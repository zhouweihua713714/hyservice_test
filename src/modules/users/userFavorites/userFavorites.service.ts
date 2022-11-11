import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import { ListFavoriteTreatiseDto, OperateTreatisesDto } from './userFavorites.dto';
import {
  treatisesRepository,
  userFavoriteTreatisesRepository,
  userLabelTreatisesRepository,
} from '@/modules/repository/repository';
import { In, IsNull } from 'typeorm';
import { Content_Status_Enum, Labels_Enum, Operate_types_Enum } from '@/common/enums/common.enum';

export class UserFavoritesService {
  /**
   * @description 用户收藏论文列表
   * @param {ListFavoriteTreatiseDto} params 用户收藏论文列表的相关参数
   * @returns {ResultData} 返回listFavoriteTreatise信息
   */
  async listFavoriteTreatise(
    params: ListFavoriteTreatiseDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { page, size } = params;
    // get favorite treatise
    const [favoriteTreatises, count] = await userFavoriteTreatisesRepository.findAndCount({
      where: {
        userId: user.id,
        treatise: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
        },
      },
      relations: ['treatise'],
      skip: (page - 1) * size,
      take: size,
      order: {
        createdAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { favoriteTreatises: [], count: count } });
    }
    // user labels
    const userLabels = await userLabelTreatisesRepository.find({
      where: {
        treatise: {
          id: In(
            favoriteTreatises.map((data) => {
              return data.treatiseId;
            })
          ),
        },
      },
    });
    const labels = _.groupBy(userLabels, 'treatiseId');
    const result = favoriteTreatises.map((data) => {
      // get maxCount
      let labelCount: { id: string; count: number }[] = [
        { id: Labels_Enum.Label_001, count: 0 },
        { id: Labels_Enum.Label_002, count: 0 },
        { id: Labels_Enum.Label_003, count: 0 },
        { id: Labels_Enum.Label_004, count: 0 },
      ];
      if (labels[data.treatiseId]) {
        const groupLabels = _.groupBy(labels[data.treatiseId], 'label');
        labelCount = labelCount.map((data) => {
          return {
            id: data.id,
            count: groupLabels[data.id] ? groupLabels[data.id].length : 0,
          };
        });
      }
      const maxCount = _.maxBy(labelCount, 'count');
      return {
        treatiseId: data.treatiseId,
        createdAt: data.createdAt,
        title: data.treatise.title,
        columnId: data.treatise.columnId,
        label: maxCount && maxCount.count !== 0 ? maxCount.id : null,
      };
    });
    return ResultData.ok({ data: { favoriteTreatises: result, count: count } });
  }
  /**
   * @description 用户操作收藏论文（加入、移出）,
   * @param {OperateTreatisesDto} params 用户操作收藏论文参数
   * @returns {ResultData} 返回操作结果
   */
  async operateTreatises(params: OperateTreatisesDto, user: SignInResInfo): Promise<ResultData> {
    const { ids, type } = params;
    // get necessary data
    const treatises = await treatisesRepository.find({
      where: {
        id: In(params.ids),
        status: Content_Status_Enum.ACTIVE,
        deletedAt: IsNull(),
        enabled: true,
      },
      select: ['id'],
    });
    // filter status is permitted
    if (treatises.length === 0) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    let succeed = 0;
    if (type === Operate_types_Enum.Add) {
      // insert
      const affectedRows = await userFavoriteTreatisesRepository.save(
        treatises.map((data) => {
          return {
            treatise: {
              id: data.id,
            },
            userId: user.id,
            updatedAt: new Date(),
          };
        })
      );
      succeed = affectedRows.length;
    }
    if (type === Operate_types_Enum.Remove) {
      // remove
      const affectedRows = await userFavoriteTreatisesRepository.delete({
        treatise: {
          id: In(
            treatises.map((data) => {
              return data.id;
            })
          ),
        },
        userId: user.id,
      });
      succeed = affectedRows.affected as number;
    }
    return ResultData.ok({ data: { succeed: succeed, failed: ids.length - succeed } });
  }
}
