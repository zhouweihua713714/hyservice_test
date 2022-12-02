import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  policiesRepository,
  policyTypesRepository,
  topicTypesRepository,
  userHistoryRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetPolicyDetailDto,
  ListComplexPolicyDto,
  ListPolicyDto,
  OperatePoliciesDto,
  RecommendPoliciesDto,
  RemovePoliciesDto,
  SavePolicyDto,
} from './policies.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  Education_Level_Enum,
  Picker_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like } from 'typeorm';
import { constant } from '@/common/utils/constant';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { dateFormat } from '@/common/utils/dateFormat';

@Injectable()
export class PoliciesService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description 获取政策详情
   * @param {GetPolicyDetailDto} params
   * @returns {ResultData} 返回getPolicyDetail信息
   */
  async getPolicyDetail(params: GetPolicyDetailDto, user: SignInResInfo): Promise<ResultData> {
    const policyInfo = await policiesRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!policyInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const type = policyInfo.type ? policyInfo.type : '-1';
    const topicType = policyInfo.topicType ? (policyInfo.topicType as string[]) : ['-1'];
    const [columnInfo, typeInfo, topicTypeInfo] = await Promise.all([
      columnsRepository.findOneBy({ id: policyInfo.columnId }),
      policyTypesRepository.findOneBy({ id: type }),
      topicTypesRepository.findBy({ id: In(topicType) }),
    ]);
    let userInfo;
    if (policyInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: policyInfo.ownerId });
    }
    const result = {
      typeName: typeInfo ? typeInfo.name : null,
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...policyInfo,
      topicTypeName: topicTypeInfo
        ? _.join(
            topicTypeInfo.map((data) => {
              return data.name;
            }),
            ';'
          )
        : null,
    };
    // update clicks
    if (params.flag) {
      await policiesRepository.update(params.id, { clicks: policyInfo.clicks + 1 });
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
   * @description 保存政策
   * @param {SavePolicyDto} params 保存政策的相关参数
   * @returns {ResultData} 返回savePolicy信息
   */
  async savePolicy(params: SavePolicyDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, type, columnId, educationLevel, level, announcedAt, picker, topicType } =
      params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if announcedAt is true picker must be true
    if (announcedAt && !picker) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.PICKER_NECESSARY_ERROR });
    }
    // if type not found in database, then throw error
    if (type) {
      const typeInfo = await policyTypesRepository.findOneBy({ id: type });
      if (!typeInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TYPE_NOT_FOUND_ERROR });
      }
    }
    // if topic type not found in database, then throw error
    if (topicType) {
      const topicTypeInfo = await topicTypesRepository.findBy({ id: In(topicType) });
      if (topicTypeInfo.length !== topicType.length) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TOPIC_TYPE_NOT_FOUND_ERROR });
      }
    }
    // if level not found, then throw error
    if (level && level !== constant.POLICY_LEVEL) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.POLICY_LEVEL_NOT_FOUND_ERROR });
    }
    // if education level not permitted, then throw error
    if (
      educationLevel &&
      _.find(educationLevel, function (o) {
        return (
          o !== Education_Level_Enum.BASIC &&
          o !== Education_Level_Enum.HIGHER &&
          o !== Education_Level_Enum.VOCATION
        );
      })
    ) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.EDUCATION_LEVEL_NOT_FOUND_ERROR });
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    if (id) {
      // if id exist get policyInfo
      const policyInfo = await policiesRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!policyInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await policiesRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 政策列表
   * @param {ListPolicyDto} params
   * @returns {ResultData} 返回listPolicy信息
   */
  async listPolicy(params: ListPolicyDto, user: SignInResInfo): Promise<ResultData> {
    const { columnId, name, status, page, size } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    let statusCondition;
    let columnCondition;
    let nameCondition;
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
    if (name) {
      nameCondition = {
        name: Like(`%${name}%`),
      };
    }
    // get policies
    const [policies, count] = await policiesRepository.findAndCount({
      where: {
        ...statusCondition,
        ...columnCondition,
        ...nameCondition,
        enabled: true,
        deletedAt: IsNull(),
      },
      select: ['id', 'columnId', 'name', 'clicks', 'status', 'updatedAt'],
      skip: (page - 1) * size,
      take: size,
      order: {
        status: 'DESC',
        updatedAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { policies: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          policies.map((policy) => {
            return policy.columnId;
          })
        ),
      },
    });
    const result = policies.map((policy) => {
      return {
        id: policy.id,
        name: policy.name,
        clicks: policy.clicks,
        status: policy.status,
        updatedAt: policy.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === policy.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { policies: result, count: count } });
  }
  /**
   * @description 操作政策
   * @param {OperatePoliciesDto} params 操作政策的相关参数
   * @returns {ResultData} 返回operatePolicies信息
   */
  async operatePolicies(params: OperatePoliciesDto, user: SignInResInfo): Promise<ResultData> {
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
    const success = await policiesRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await policiesRepository.update(
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
   * @description 删除政策
   * @param {RemovePoliciesDto} params 删除政策的相关参数
   * @returns {ResultData} 返回removePolicies信息
   */
  async removePolicies(params: RemovePoliciesDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await policiesRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await policiesRepository.update(
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
   * @description 政策列表(c端)
   * @param {ListComplexPolicyDto} params 政策(c端)列表参数
   * @returns {ResultData} 返回listComplexPolicy信息
   */
  async listComplexPolicy(params: ListComplexPolicyDto, user: SignInResInfo): Promise<ResultData> {
    const { keyword, type, topicType, announcedAt, picker, educationLevel, columnId, page, size } =
      params;
    // get basic condition
    let policies, count, keywords;
    const month = 'yyyy-mm';
    const date = 'yyyy-mm-dd';
    let announcedAtDateString;
    let basicCondition =
      'policies.enabled = true and policies.deletedAt is null and policies.status =:status';
    if (type) {
      basicCondition += ' and policies.type =:type';
    }
    if (topicType) {
      basicCondition += ' and policies.topic_type::jsonb ?| ARRAY[:topicType]';
    }
    if (columnId) {
      basicCondition += ' and policies.columnId =:columnId';
    }
    if (educationLevel) {
      basicCondition += ' and policies.education_level::jsonb ?| ARRAY[:educationLevel]';
    }
    if (picker && picker === Picker_Enum.Year && announcedAt) {
      basicCondition += ' and extract(year from policies.announcedAt) =:year';
    }
    if (picker && picker === Picker_Enum.Date && announcedAt) {
      announcedAtDateString = dateFormat(announcedAt, Picker_Enum.Date);
      basicCondition += ` and to_char(policies.announcedAt,'${date}') =:announcedAt`;
    }
    if (picker && picker === Picker_Enum.Month && announcedAt) {
      announcedAtDateString = dateFormat(announcedAt, Picker_Enum.Month);
      basicCondition += ` and to_char(policies.announcedAt,'${month}') =:announcedAt`;
    }
    if (keyword) {
      // get keywords
      keywords = `%${keyword.toLowerCase().replace(/;/g, '%;%')}%`.split(';');
      [policies, count] = await policiesRepository
        .createQueryBuilder('policies')
        .select([
          'policies.id',
          'policies.name',
          'policies.announcedAt',
          'policies.picker',
          'policies.announceNo',
          'policies.institution',
          'policies.educationLevel',
          'policies.region',
          'policies.introduction',
          'policies.content',
          'policies.type',
          'policies.keyword',
          'policies.url',
          'policies.level',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          type: type,
          topicType: topicType,
          columnId: columnId,
          educationLevel: educationLevel,
          year: announcedAt ? new Date(announcedAt).getFullYear() : undefined,
          announcedAt: announcedAtDateString,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(policies.name) like any (ARRAY[:...keyword])', {
              keyword: keywords,
            }).orWhere('LOWER(policies.keyword) like any (ARRAY[:...keyword])', {
              keyword: keywords,
            });
          })
        )
        .orderBy('policies.announcedAt', 'DESC', 'NULLS LAST')
        .addOrderBy('policies.publishedAt', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    } else {
      // get policies and count
      [policies, count] = await policiesRepository
        .createQueryBuilder('policies')
        .select([
          'policies.id',
          'policies.name',
          'policies.announcedAt',
          'policies.picker',
          'policies.announceNo',
          'policies.institution',
          'policies.educationLevel',
          'policies.region',
          'policies.introduction',
          'policies.content',
          'policies.type',
          'policies.keyword',
          'policies.url',
          'policies.level',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          type: type,
          topicType: topicType,
          columnId: columnId,
          educationLevel: educationLevel,
          year: announcedAt ? new Date(announcedAt).getFullYear() : undefined,
          announcedAt: announcedAtDateString,
        })
        .orderBy('policies.announcedAt', 'DESC', 'NULLS LAST')
        .addOrderBy('policies.publishedAt', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    }
    if (count === 0) {
      return ResultData.ok({ data: { policies: [], count: count } });
    }
    // get types
    const types = await policyTypesRepository.findBy({
      id: In(
        policies.map((data) => {
          return data.type;
        })
      ),
    });
    const result = policies.map((data) => {
      return {
        ...data,
        typeName: _.find(types, function (o) {
          return o.id === data.type;
        })
          ? _.find(types, function (o) {
              return o.id === data.type;
            })?.name
          : null,
      };
    });
    // 搜索埋点
    await this.usersService.recordUserSearchTimes({
      keywords: keyword?.split(';') || [],
      type: Content_Types_Enum.POLICY,
      userId: user?.id,
      columnId: columnId || '0',
    });
    return ResultData.ok({ data: { policies: result, count: count } });
  }
  /**
   * @description 推荐政策
   * @param {RecommendPoliciesDto} params 推荐的相关参数
   * @returns {ResultData} 返回recommendPolicies信息
   */
  async recommendPolicies(params: RecommendPoliciesDto, user: SignInResInfo): Promise<ResultData> {
    const { id } = params;
    const policyInfo = await policiesRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    // get columns
    const columns = await columnsRepository.find({
      where: {
        parentId: In(['column_04']),
        isHide: 0,
      },
      select: ['id', 'name'],
    });
    const keyword = policyInfo?.keyword;
    const type = policyInfo?.type;
    let policies;
    let basicCondition =
      'policies.enabled = true and policies.deletedAt is null and policies.status =:status';
    if (policyInfo) {
      basicCondition += ' and policies.id !=:id';
    }
    // if columns is hide, related data is hide
    if (columns && columns.length > 0) {
      basicCondition += ' and policies.columnId in (:...columnIds)';
    }
    if (columns && columns.length === 0) {
      // eslint-disable-next-line quotes
      basicCondition += ` and policies.columnId ='-1'`;
    }
    if (keyword) {
      const keywords = `%${keyword.replace(/;/g, '%;%')}%`.split(';');
      policies = await policiesRepository
        .createQueryBuilder('policies')
        .select(['policies.id', 'policies.name'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: policyInfo?.id,
          columnIds: columns.map((data) => {
            return data.id;
          }),
        })
        .andWhere('policies.keyword like any (ARRAY[:...keyword])', {
          keyword: keywords,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(9)
        .getMany();
    }
    let idsCondition = '';
    // if policies count < 9 then type recommend
    if (policies && policies.length < 9) {
      if (policies.length > 0) {
        idsCondition = ' and id not in (:...ids)';
      }
      if (type) {
        const newPolicies = await policiesRepository
          .createQueryBuilder('policies')
          .select(['policies.id', 'policies.name'])
          .where(`${basicCondition}${idsCondition}`, {
            status: Content_Status_Enum.ACTIVE,
            id: policyInfo?.id,
            ids: policies.map((data) => {
              return data.id;
            }),
            columnIds: columns.map((data) => {
              return data.id;
            }),
          })
          .andWhere('policies.type =:type', {
            type: type,
          })
          .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
          .take(9 - policies.length)
          .getMany();
        policies = _.unionBy(policies, newPolicies, 'id');
      }
    }
    // if policies count < 8 then all policy recommend
    if (!policyInfo || !policies || (policies && policies.length < 9)) {
      let size = 9;
      if (policies) {
        size = size - policies.length;
      }
      const newPolicies = await policiesRepository
        .createQueryBuilder('policies')
        .select(['policies.id', 'policies.name'])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: policyInfo?.id,
          ids: policies
            ? policies.map((data) => {
                return data.id;
              })
            : undefined,
          columnIds: columns.map((data) => {
            return data.id;
          }),
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      policies = _.unionBy(policies, newPolicies, 'id');
    }
    const result = policies.map((policy) => {
      return {
        ...policy,
      };
    });
    return ResultData.ok({
      data: { policies: result ? result : [] },
    });
  }
  /**
   * @description 政策分布
   * @param {} params 政策分布的相关参数
   * @returns {ResultData} 返回getCountBYRegion信息
   */
  async getPolicyCountByRegion(params: any, user: SignInResInfo): Promise<ResultData> {
    const regions = await policiesRepository
      .createQueryBuilder('policies')
      .select('COUNT(policies.id)', 'count')
      .addSelect('policies.region', 'region')
      .where(
        'policies.enabled = true and policies.deletedAt is null and policies.status =:status',
        {
          status: Content_Status_Enum.ACTIVE,
        }
      )
      .groupBy('policies.region')
      .getRawMany();
    return ResultData.ok({
      data: { regions: regions },
    });
  }
}
