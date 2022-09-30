import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  institutionsRepository,
  fieldsRepository,
  usersRepository,
  userHistoryRepository,
} from '../repository/repository';
import {
  GetInstitutionDetailDto,
  ListComplexInstitutionDto,
  ListInstitutionDto,
  OperateInstitutionsDto,
  RecommendInstitutionsDto,
  RemoveInstitutionsDto,
  SaveInstitutionDto,
} from './institutions.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';

export class InstitutionsService {
  /**
   * @description 获取机构详情
   * @param {GetInstitutionDetailDto} params
   * @returns {ResultData} 返回getInstitutionDetail信息
   */
  async getInstitutionDetail(
    params: GetInstitutionDetailDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const institutionInfo = await institutionsRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!institutionInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: institutionInfo.columnId });
    // get necessary data
    let userInfo;
    let fields;
    let minorFields;
    if (institutionInfo.field) {
      fields = await fieldsRepository.findBy({ id: In(institutionInfo.field as string[]) });
    }
    if (institutionInfo.minorField) {
      minorFields = await fieldsRepository.findBy({
        id: In(institutionInfo.minorField as string[]),
      });
    }
    if (institutionInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: institutionInfo.ownerId });
    }
    const result = {
      fieldName: fields
        ? _.join(
            fields.map((field) => {
              return field.name;
            }),
            ';'
          )
        : null,
      minorFieldName: minorFields
        ? _.join(
            minorFields.map((minorField) => {
              return minorField.name;
            }),
            ';'
          )
        : null,
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...institutionInfo,
    };
    // update clicks
    if (params.flag) {
      await institutionsRepository.update(params.id, { clicks: institutionInfo.clicks + 1 });
    }
    // if user login then record history
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.INSTITUTION,
      });
    }
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存机构
   * @param {SaveInstitutionDto} params 保存机构的相关参数
   * @returns {ResultData} 返回saveInstitution信息
   */
  async saveInstitution(params: SaveInstitutionDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, columnId, field, minorField } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    // if field not found in database, then throw error
    if (field) {
      const fields = await fieldsRepository.findBy({
        id: In(field),
        isMain: 1,
        type: Like(`%${Content_Types_Enum.INSTITUTION}%`),
      });
      if (!fields || (fields && fields.length !== field.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.FILED_NOT_FOUND_ERROR });
      }
    }
    // if field not found in database, then throw error
    if (minorField) {
      const fields = await fieldsRepository.findBy({
        id: In(minorField),
        isMain: 0,
        type: Like(`%${Content_Types_Enum.INSTITUTION}%`),
      });
      if (!fields || (fields && fields.length !== minorField.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.MINOR_FILED_NOT_FOUND_ERROR });
      }
    }
    if (id) {
      // if id exist get institutionInfo
      const institutionInfo = await institutionsRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!institutionInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await institutionsRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 机构列表
   * @param {ListInstitutionDto} params
   * @returns {ResultData} 返回listInstitution信息
   */
  async listInstitution(params: ListInstitutionDto, user: SignInResInfo): Promise<ResultData> {
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
    // get institutions
    const [institutions, count] = await institutionsRepository.findAndCount({
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
      return ResultData.ok({ data: { institutions: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          institutions.map((institution) => {
            return institution.columnId;
          })
        ),
      },
    });
    const result = institutions.map((institution) => {
      return {
        id: institution.id,
        name: institution.name,
        clicks: institution.clicks,
        status: institution.status,
        updatedAt: institution.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === institution.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { institutions: result, count: count } });
  }
  /**
   * @description 操作机构
   * @param {OperateInstitutionsDto} params 操作机构的相关参数
   * @returns {ResultData} 返回operateInstitutions信息
   */
  async operateInstitutions(
    params: OperateInstitutionsDto,
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
    const success = await institutionsRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await institutionsRepository.update(
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
   * @description 删除机构
   * @param {RemoveInstitutionsDto} params 删除机构的相关参数
   * @returns {ResultData} 返回removeInstitutions信息
   */
  async removeInstitutions(
    params: RemoveInstitutionsDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await institutionsRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await institutionsRepository.update(
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
   * @description 机构列表(c端)
   * @param {ListComplexInstitutionDto} params机构列表参数
   * @returns {ResultData} 返回listComplexInstitution信息
   */
  async listComplexInstitution(
    params: ListComplexInstitutionDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { keyword, page, size } = params;
    // get basic condition
    const month = 'yyyy-mm';
    const date = 'yyyy-mm-dd';
    let conductedAtDateString;
    let endedAtDateString;
    let keywords;
    let basicCondition =
      'institutions.enabled = true and institutions.deletedAt is null and institutions.status =:status';
    if (keyword) {
      // get keywords
      keywords = `%${keyword.replace(';', '%;%')}%`.split(';');
      basicCondition += ' and institutions.name like any (ARRAY[:...keyword])';
    }
    // get institutions and count
    const [institutions, count] = await institutionsRepository
      .createQueryBuilder('institutions')
      .select([
        'institutions.id',
        'institutions.name',
        'institutions.foreignName',
        'institutions.address',
        'institutions.introduction',
        'institutions.unit',
        'institutions.field',
        'institutions.minorField',
        'institutions.website',
        'institutions.url',
      ])
      .where(`${basicCondition}`, {
        status: Content_Status_Enum.ACTIVE,
        keyword: keywords,
      })
      .orderBy('institutions.publishedAt', 'DESC')
      .skip(page - 1)
      .take(size)
      .getManyAndCount();

    if (count === 0) {
      return ResultData.ok({ data: { institutions: [], count: count } });
    }
    // get fields
    let periodIds;
    institutions.map((data) => {
      periodIds = _.union(data.field as string[], periodIds);
      periodIds = _.union(data.minorField as string[], periodIds);
    });
    periodIds = _.uniq(periodIds);
    let fields;
    if (periodIds.length > 0) {
      fields = await fieldsRepository.findBy({
        id: In(periodIds),
        type: Like(`%${Content_Types_Enum.INSTITUTION}%`),
      });
    }
    const result = institutions.map((data) => {
      let fieldInfo;
      let minorFieldInfo;
      if (data.field) {
        fieldInfo = (data.field as string[]).map((data) => {
          return {
            name: _.find(fields, function (o) {
              return o.id === data;
            })
              ? _.find(fields, function (o) {
                  return o.id === data;
                }).name
              : null,
          };
        });
      }
      if (data.minorField) {
        minorFieldInfo = (data.minorField as string[]).map((data) => {
          return {
            name: _.find(fields, function (o) {
              return o.id === data;
            })
              ? _.find(fields, function (o) {
                  return o.id === data;
                }).name
              : null,
          };
        });
      }
      return {
        ...data,
        fieldName: fieldInfo
          ? _.join(
              fieldInfo.map((data) => {
                return data.name;
              }),
              ';'
            )
          : null,
        minorField: minorFieldInfo
          ? _.join(
              minorFieldInfo.map((data) => {
                return data.name;
              }),
              ';'
            )
          : null,
      };
    });
    return ResultData.ok({ data: { institutions: result, count: count } });
  }

  /**
   * @description 推荐机构
   * @param {RecommendInstitutionsDto} params 推荐的相关参数
   * @returns {ResultData} 返回recommendInstitutions信息
   */
  async recommendInstitutions(
    params: RecommendInstitutionsDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    const institutionInfo = await institutionsRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    const field = institutionInfo?.field as string[];
    const minorField = institutionInfo?.minorField as string[];
    let institutions;
    let basicCondition =
      'institutions.enabled = true and institutions.deletedAt is null and institutions.status =:status';
    if (institutionInfo) {
      basicCondition += ' and institutions.id !=:id';
    }
    if (field) {
      institutions = await institutionsRepository
        .createQueryBuilder('institutions')
        .select(['institutions.id', 'institutions.name', 'institutions.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: institutionInfo?.id,
        })
        .andWhere('institutions.field::jsonb ?| ARRAY[:...field]', {
          field: field,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(8)
        .getMany();
    }
    let idsCondition = '';
    // if institutions count < 8 then minorField recommend
    if (institutions && institutions.length < 8) {
      if (institutions.length > 0) {
        idsCondition = ' and id not in (:...ids)';
      }
      if (minorField) {
        const newConferences = await institutionsRepository
          .createQueryBuilder('institutions')
          .select(['institutions.id', 'institutions.name', 'institutions.columnId'])
          .where(`${basicCondition}${idsCondition}`, {
            status: Content_Status_Enum.ACTIVE,
            id: institutionInfo?.id,
            ids: institutions.map((data) => {
              return data.id;
            }),
          })
          .andWhere('institutions.minor_field::jsonb ?| ARRAY[:...minorField]', {
            minorField: minorField,
          })
          .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
          .take(8 - institutions.length)
          .getMany();
        institutions = _.unionBy(institutions, newConferences, 'id');
      }
    }
    // if institutions count < 8 then all institution recommend
    if (!institutionInfo || (institutions && institutions.length < 8)) {
      let size = 8;
      if (institutions) {
        size = size - institutions.length;
      }
      const newConferences = await institutionsRepository
        .createQueryBuilder('institutions')
        .select(['institutions.id', 'institutions.name', 'institutions.columnId'])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: institutionInfo?.id,
          ids: institutions
            ? institutions.map((data) => {
                return data.id;
              })
            : undefined,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      institutions = _.unionBy(institutions, newConferences, 'id');
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          institutions.map((institution) => {
            return institution.columnId;
          })
        ),
      },
    });
    const result = institutions.map((institution) => {
      return {
        ...institution,
        columnName: _.find(columns, function (o) {
          return o.id === institution.columnId;
        })?.name,
      };
    });
    return ResultData.ok({
      data: { institutions: result ? result : [] },
    });
  }
}
