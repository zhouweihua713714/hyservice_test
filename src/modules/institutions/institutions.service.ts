import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  institutionsRepository,
  fieldsRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetInstitutionDetailDto,
  ListInstitutionDto,
  OperateInstitutionsDto,
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
  async getInstitutionDetail(params: GetInstitutionDetailDto, user: SignInResInfo): Promise<ResultData> {
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
}
