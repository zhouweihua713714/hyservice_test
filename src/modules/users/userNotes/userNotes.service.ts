import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  GetNoteTreatiseDetailDto,
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
    const userNodeTreatiseInfo = await userNoteTreatisesRepository.findOne({
      where: { id: id, userId: user.id },
      relations: ['treatise'],
    });
    if (!userNodeTreatiseInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    // get return data
    const result = {
      id: userNodeTreatiseInfo.id,
      userId: userNodeTreatiseInfo.userId,
      treatiseId: userNodeTreatiseInfo.treatiseId,
      comment: userNodeTreatiseInfo.comment,
      content: userNodeTreatiseInfo.content,
      url: userNodeTreatiseInfo?.treatise.url,
      title: userNodeTreatiseInfo?.treatise.title,
      updatedAt: userNodeTreatiseInfo.updatedAt,
      commentedAt: userNodeTreatiseInfo.commentedAt,
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
    let userNodeTreatiseInfo;
    if (id) {
      userNodeTreatiseInfo = await userNoteTreatisesRepository.findOneBy({ id: id });
      if (!userNodeTreatiseInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    }
    const result = await userNoteTreatisesRepository.save({
      userId: user.id,
      updatedAt: id && userNodeTreatiseInfo.content !== content ? new Date() : undefined,
      commentedAt:
        id && comment && userNodeTreatiseInfo && userNodeTreatiseInfo.comment !== comment
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
}
