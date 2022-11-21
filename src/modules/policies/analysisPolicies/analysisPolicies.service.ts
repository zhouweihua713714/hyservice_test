import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  analysisPoliciesRepository,
  usersRepository,
  userHistoryRepository,
} from '../../repository/repository';
import {
  GetAnalysisPolicyDetailDto,
  ListAnalysisPolicyDto,
  ListComplexAnalysisPolicyDto,
  OperateAnalysisPoliciesDto,
  RecommendAnalysisPoliciesDto,
  RemoveAnalysisPoliciesDto,
  SaveAnalysisPolicyDto,
} from './analysisPolicies.dto';
import { Content_Status_Enum, Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';

export class AnalysisPoliciesService {
  /**
   * @description 获取政策解读详情
   * @param {GetAnalysisPolicyDetailDto} params
   * @returns {ResultData} 返回getAnalysisPolicyDetail信息
   */
  async getAnalysisPolicyDetail(
    params: GetAnalysisPolicyDetailDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const analysisPolicyInfo = await analysisPoliciesRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!analysisPolicyInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: analysisPolicyInfo.columnId });
    let userInfo;
    if (analysisPolicyInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: analysisPolicyInfo.ownerId });
    }
    const result = {
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...analysisPolicyInfo,
    };
    // update clicks
    if (params.flag) {
      await analysisPoliciesRepository.update(params.id, { clicks: analysisPolicyInfo.clicks + 1 });
    }
    // if user login then record history
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.POLICY,
      });
    }
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存政策解读
   * @param {SaveAnalysisPolicyDto} params 保存政策解读的相关参数
   * @returns {ResultData} 返回saveAnalysisPolicy信息
   */
  async saveAnalysisPolicy(
    params: SaveAnalysisPolicyDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id, status, columnId } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    if (id) {
      // if id exist get analysisPolicyInfo
      const analysisPolicyInfo = await analysisPoliciesRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!analysisPolicyInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await analysisPoliciesRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 政策解读列表
   * @param {ListAnalysisPolicyDto} params
   * @returns {ResultData} 返回listAnalysisPolicy信息
   */
  async listAnalysisPolicy(
    params: ListAnalysisPolicyDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId, title, status, page, size } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    let statusCondition;
    let columnCondition;
    let titleCondition;
    if (status) {
      statusCondition = {
        status: status,
      };
    }
    if (columnId) {
      columnCondition = {
        columnId: columnId,
      };
    }
    if (title) {
      titleCondition = {
        title: Like(`%${title}%`),
      };
    }
    // get analysisPolicies
    const [analysisPolicies, count] = await analysisPoliciesRepository.findAndCount({
      where: {
        ...statusCondition,
        ...columnCondition,
        ...titleCondition,
        enabled: true,
        deletedAt: IsNull(),
      },
      select: ['id', 'columnId', 'title', 'clicks', 'status', 'updatedAt'],
      skip: (page - 1) * size,
      take: size,
      order: {
        status: 'DESC',
        updatedAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { analysisPolicies: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          analysisPolicies.map((analysisPolicy) => {
            return analysisPolicy.columnId;
          })
        ),
      },
    });
    const result = analysisPolicies.map((analysisPolicy) => {
      return {
        id: analysisPolicy.id,
        title: analysisPolicy.title,
        clicks: analysisPolicy.clicks,
        status: analysisPolicy.status,
        updatedAt: analysisPolicy.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === analysisPolicy.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { analysisPolicies: result, count: count } });
  }
  /**
   * @description 操作政策解读
   * @param {OperateAnalysisPoliciesDto} params 操作政策解读的相关参数
   * @returns {ResultData} 返回operateAnalysisPolicies信息
   */
  async operateAnalysisPolicies(
    params: OperateAnalysisPoliciesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids, status } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    let statusCondition;
    if (status === Content_Status_Enum.ACTIVE) {
      statusCondition = {
        status: Content_Status_Enum.READY,
      };
    }
    if (status === Content_Status_Enum.READY) {
      statusCondition = {
        status: Content_Status_Enum.ACTIVE,
      };
    }
    const success = await analysisPoliciesRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await analysisPoliciesRepository.update(
      success.map((data) => {
        return data.id;
      }),
      {
        status: status,
        publishedAt: status === Content_Status_Enum.ACTIVE ? new Date() : undefined,
      }
    );
    const succeed = affected.affected ? affected.affected : 0;
    return ResultData.ok({
      data: { succeed: succeed, failed: ids.length - succeed },
    });
  }
  /**
   * @description 删除政策解读
   * @param {RemoveAnalysisPoliciesDto} params 删除政策解读的相关参数
   * @returns {ResultData} 返回removeAnalysisPolicies信息
   */
  async removeAnalysisPolicies(
    params: RemoveAnalysisPoliciesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await analysisPoliciesRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await analysisPoliciesRepository.update(
      success.map((data) => {
        return data.id;
      }),
      {
        deletedAt: new Date(),
        enabled: false,
      }
    );
    const succeed = affected.affected ? affected.affected : 0;
    return ResultData.ok({
      data: { succeed: succeed, failed: ids.length - succeed },
    });
  }
  /**
   * @description 政策解读列表(c端)
   * @param {ListComplexAnalysisPolicyDto} params
   * @returns {ResultData} 返回listComplexAnalysisPolicy信息
   */
  async listComplexAnalysisPolicy(
    params: ListComplexAnalysisPolicyDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId, page, size } = params;
    let basicCondition =
      'analysis_policies.enabled = true and analysis_policies.deletedAt is null and analysis_policies.status =:status';
    if (columnId) {
      basicCondition += ' and analysis_policies.columnId =:columnId';
    }
    // get analysisPolicies
    const [analysisPolicies, count] = await analysisPoliciesRepository
      .createQueryBuilder('analysis_policies')
      .select([
        'analysis_policies.id',
        'analysis_policies.title',
        'analysis_policies.announcedAt',
        'analysis_policies.source',
      ])
      .where(`${basicCondition}`, {
        status: Content_Status_Enum.ACTIVE,
        columnId: columnId,
      })
      .orderBy('analysis_policies.announcedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('analysis_policies.publishedAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
    if (count === 0) {
      return ResultData.ok({ data: { analysisPolicies: [], count: count } });
    }
    const result = analysisPolicies.map((analysisPolicy) => {
      return {
        ...analysisPolicy,
      };
    });
    return ResultData.ok({ data: { analysisPolicies: result, count: count } });
  }
  /**
   * @description 推荐政策解读
   * @param {RecommendPoliciesDto} params 推荐的相关参数
   * @returns {ResultData} 返回recommendPolicies信息
   */
  async recommendAnalysisPolicies(
    params: RecommendAnalysisPoliciesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    const analysisPolicyInfo = await analysisPoliciesRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    const source = analysisPolicyInfo?.source;
    let analysisPolicies;
    let basicCondition =
      'analysisPolicies.enabled = true and analysisPolicies.deletedAt is null and analysisPolicies.status =:status';
    if (analysisPolicyInfo) {
      basicCondition += ' and analysisPolicies.id !=:id';
    }
    if (source) {
      analysisPolicies = await analysisPoliciesRepository
        .createQueryBuilder('analysisPolicies')
        .select([
          'analysisPolicies.id',
          'analysisPolicies.title',
          'analysisPolicies.source',
          'analysisPolicies.announcedAt',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: analysisPolicyInfo?.id,
        })
        .andWhere('analysisPolicies.source =:source', {
          source: source,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(5)
        .getMany();
    }
    let idsCondition = '';
    // if analysisPolicies count < 5 then random recommend
    if (analysisPolicies && analysisPolicies.length < 5) {
      if (analysisPolicies.length > 0) {
        idsCondition = ' and id not in (:...ids)';
      }
    }
    // if analysisPolicies count < 8 then all analysisPolicy recommend
    if (
      !analysisPolicyInfo ||
      !analysisPolicies ||
      (analysisPolicies && analysisPolicies.length < 5)
    ) {
      let size = 5;
      if (analysisPolicies) {
        size = size - analysisPolicies.length;
      }
      const newAnalysisPolicies = await analysisPoliciesRepository
        .createQueryBuilder('analysisPolicies')
        .select([
          'analysisPolicies.id',
          'analysisPolicies.title',
          'analysisPolicies.source',
          'analysisPolicies.announcedAt',
        ])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: analysisPolicyInfo?.id,
          ids: analysisPolicies
            ? analysisPolicies.map((data) => {
                return data.id;
              })
            : undefined,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      analysisPolicies = _.unionBy(analysisPolicies, newAnalysisPolicies, 'id');
    }
    const result = analysisPolicies.map((analysisPolicy) => {
      return {
        ...analysisPolicy,
      };
    });
    return ResultData.ok({
      data: { analysisPolicies: result ? result : [] },
    });
  }
}
