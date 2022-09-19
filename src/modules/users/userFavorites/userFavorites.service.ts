import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import { ListHistoryDto, OperateTreatisesDto } from './userFavorites.dto';
import {
  treatisesRepository,
  userFavoriteTreatisesRepository,
  userHistoryRepository,
} from '@/modules/repository/repository';
import { In, IsNull } from 'typeorm';
import { Content_Status_Enum, Operate_types_Enum } from '@/common/enums/common.enum';

export class UserFavoritesService {
  /**
   * @description 用户浏览历史
   * @param {ListHistoryDto} params 用户浏览历史的相关参数
   * @returns {ResultData} 返回listHistory信息
   */
  async listHistory(params: ListHistoryDto, user: SignInResInfo): Promise<ResultData> {
    const { page, size } = params;
    // get user history
    const [userHistory, count] = await userHistoryRepository.findAndCount({
      where: {
        userId: user.id,
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        createdAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { userHistory: [], count: count } });
    }
    return ResultData.ok({ data: { userHistory: [], count: count } });
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
