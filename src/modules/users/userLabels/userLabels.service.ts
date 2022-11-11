import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import { ListLabelTreatiseDto, OperateLabelTreatisesDto } from './userLabels.dto';
import { treatisesRepository, userLabelTreatisesRepository } from '@/modules/repository/repository';
import { In, IsNull } from 'typeorm';
import { Content_Status_Enum, Operate_types_Enum } from '@/common/enums/common.enum';

export class UserLabelsService {
  /**
   * @description 用户标签论文列表
   * @param {ListLabelTreatiseDto } params 用户标签论文列表的相关参数
   * @returns {ResultData} 返回listLabelTreatise信息
   */
  async listLabelTreatise(params: ListLabelTreatiseDto, user: SignInResInfo): Promise<ResultData> {
    const { page, size, flag, label } = params;
    let labelCondition;
    if (label) {
      labelCondition = {
        label: label,
      };
    }
    let labels;
    if (flag) {
      // get user labels
      labels = await userLabelTreatisesRepository
        .createQueryBuilder('userLabelTreatises')
        .select('COUNT(userLabelTreatises.treatiseId)', 'count')
        .addSelect('userLabelTreatises.label', 'id')
        .where('userLabelTreatises.userId =:userId', {
          userId: user.id,
        })
        .groupBy('userLabelTreatises.label')
        .getRawMany();
    }
    // get user history
    const [labelTreatises, count] = await userLabelTreatisesRepository.findAndCount({
      where: {
        userId: user.id,
        ...labelCondition,
      },
      skip: (page - 1) * size,
      take: size,
      relations: ['treatise'],
      order: {
        createdAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { labelTreatises: [], count: 0 } });
    }
    const result = labelTreatises.map((data) => {
      return {
        treatiseId: data.treatiseId,
        label: data.label,
        title: data.treatise.title,
        author: data.treatise.author,
        deliveryAt: data.treatise.deliveryAt,
        releasedAt: data.treatise.releasedAt,
        columnId: data.treatise.columnId,
      };
    });
    return ResultData.ok({ data: { labelTreatises: result, count: count, labels: labels } });
  }
  /**
   * @description 用户操作论文标签（加入、移出）,
   * @param {OperateLabelTreatisesDto} params 用户操作论文标签参数
   * @returns {ResultData} 返回操作结果
   */
  async operateLabelTreatises(
    params: OperateLabelTreatisesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids, type, label } = params;
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
      const affectedRows = await userLabelTreatisesRepository.save(
        treatises.map((data) => {
          return {
            treatise: {
              id: data.id,
            },
            userId: user.id,
            updatedAt: new Date(),
            label: label,
          };
        })
      );
      succeed = affectedRows.length;
    }
    if (type === Operate_types_Enum.Remove) {
      // remove
      const affectedRows = await userLabelTreatisesRepository.delete({
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
