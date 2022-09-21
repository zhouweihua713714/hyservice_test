import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  GetNoteTreatiseDetailDto,
  ListNoteTreatiseDto,
  RemoveNoteTreatisesDto,
  SaveNoteTreatiseDto,
} from './userNotes.dto';
import {
  treatisesRepository,
  userFavoriteTreatisesRepository,
  userHistoryRepository,
  userNoteTreatisesRepository,
} from '@/modules/repository/repository';
import { In, IsNull } from 'typeorm';
import { Content_Status_Enum, Operate_types_Enum } from '@/common/enums/common.enum';
import { skip } from 'rxjs';

export class UserNotesService {
  /**
   * @description 用户添加/编辑笔记,
   * @param { GetNoteTreatiseDetailDto} params 用户添加/编辑笔记参数
   * @returns {ResultData} 返回操作结果
   */
  async getNoteTreatiseDetail(
    params: GetNoteTreatiseDetailDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    // if id not found in database, then throw error
    const userNoteTreatiseInfo = await userNoteTreatisesRepository.findOne({
      where: { id: id, userId: user.id },
      relations: ['treatise'],
    });
    if (!userNoteTreatiseInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    // get return data
    const result = {
      id: userNoteTreatiseInfo.id,
      userId: userNoteTreatiseInfo.userId,
      treatiseId: userNoteTreatiseInfo.treatiseId,
      comment: userNoteTreatiseInfo.comment,
      content: userNoteTreatiseInfo.content,
      url: userNoteTreatiseInfo?.treatise.url,
      title: userNoteTreatiseInfo?.treatise.title,
      updatedAt: userNoteTreatiseInfo.updatedAt,
      commentedAt: userNoteTreatiseInfo.commentedAt,
    };
    console.log(result);
    return ResultData.ok({ data: result });
  }
  /**
   * @description 用户添加/编辑笔记,
   * @param { SaveNoteTreatiseDto} params 用户添加/编辑笔记参数
   * @returns {ResultData} 返回操作结果
   */
  async saveNoteTreatise(params: SaveNoteTreatiseDto, user: SignInResInfo): Promise<ResultData> {
    const { id, treatiseId, comment, content } = params;
    // if treatiseId not found in database, then throw error
    const treatiseInfo = await treatisesRepository.findOneBy({
      id: treatiseId,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!treatiseInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    // if id not found in database, then throw error
    let userNoteTreatiseInfo;
    if (id) {
      userNoteTreatiseInfo = await userNoteTreatisesRepository.findOneBy({ id: id });
      if (!userNoteTreatiseInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    }
    const result = await userNoteTreatisesRepository.save({
      userId: user.id,
      updatedAt: id && userNoteTreatiseInfo.content !== content ? new Date() : undefined,
      commentedAt:
        id && comment && userNoteTreatiseInfo && userNoteTreatiseInfo.comment !== comment
          ? new Date()
          : undefined,
      ...params,
    });
    return ResultData.ok({ data: result });
  }

  /**
   * @description 删除用户论文笔记
   * @param {RemoveNoteTreatisesDto} params 用户论文笔记的相关参数
   * @returns {ResultData} 返回removeNoteTreatises信息
   */
  async removeNoteTreatises(
    params: RemoveNoteTreatisesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids } = params;
    const success = await userNoteTreatisesRepository.find({
      where: { id: In(ids), userId: user.id },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // remove
    const affected = await userNoteTreatisesRepository.delete(
      success.map((data) => {
        return data.id;
      })
    );
    const succeed = affected.affected ? affected.affected : 0;
    return ResultData.ok({
      data: { succeed: succeed, failed: ids.length - succeed },
    });
  }

  /**
   * @description 用户论文笔记列表
   * @param {ListNoteTreatiseDto} params 用户论文笔记列表的相关参数
   * @returns {ResultData} 返回listNoteTreatise信息
   */
  async listNoteTreatise(params: ListNoteTreatiseDto, user: SignInResInfo): Promise<ResultData> {
    const { page, size } = params;
    const [noteTreatises, count] = await userNoteTreatisesRepository.findAndCount({
      where: { userId: user.id },
      relations: ['treatise'],
      order: {
        updatedAt: 'DESC',
      },
      skip: page - 1,
      take: size,
    });
    if (count === 0) {
      return ResultData.ok({
        data: { noteTreatises: [], count: 0 },
      });
    }
    const result = noteTreatises.map((data) => {
      return {
        id: data.id,
        treatiseId: data.treatiseId,
        content: data.content,
        updatedAt: data.updatedAt,
        comment: data.comment,
        commentedAt: data.commentedAt,
        title: data.treatise.title,
        url: data.treatise.url,
      };
    });
    return ResultData.ok({
      data: { noteTreatises: result, count: count },
    });
  }
}
