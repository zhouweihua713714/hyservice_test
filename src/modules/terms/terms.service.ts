import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  subjectsRepository,
  termsRepository,
  termTypesRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetTermDetailDto,
  ListTermDto,
  OperateTermsDto,
  RemoveTermsDto,
  SaveTermDto,
} from './terms.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';

export class TermsService {
  /**
   * @description 获取项目详情
   * @param {GetTermDetailDto} params
   * @returns {ResultData} 返回getTermDetail信息
   */
  async getTermDetail(params: GetTermDetailDto, user: SignInResInfo): Promise<ResultData> {
    const termInfo = await termsRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!termInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const type = termInfo.type ? termInfo.type : '-1';
    const subject = termInfo.subject ? termInfo.subject : '-1';

    const [columnInfo, typeInfo, subjectInfo] = await Promise.all([
      columnsRepository.findOneBy({ id: termInfo.columnId }),
      termTypesRepository.findOneBy({ id: type }),
      subjectsRepository.findOneBy({ id: subject }),
    ]);
    let userInfo;
    if (termInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: termInfo.ownerId });
    }
    const result = {
      typeName: typeInfo ? typeInfo.name : null,
      subjectName: subjectInfo ? subjectInfo.name : null,
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...termInfo,
    };
    // update clicks
    if (params.flag) {
      await termsRepository.update(params.id, { clicks: termInfo.clicks + 1 });
    }
    // // if user login then record history
    // if (user) {
    //   console.log('用户浏览历史');
    // }
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存项目
   * @param {SaveTermDto} params 保存项目的相关参数
   * @returns {ResultData} 返回saveTerm信息
   */
  async saveTerm(params: SaveTermDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, termNumber, type, subject, columnId, startedAt, endedAt } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if type not found in database, then throw error
    if (type) {
      const typeInfo = await termTypesRepository.findOneBy({ id: type });
      if (!typeInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TYPE_NOT_FOUND_ERROR });
      }
    }
    // if subject not found in database, then throw error
    if (subject) {
      const subjectInfo = await subjectsRepository.findOneBy({ id: subject });
      if (!subjectInfo || (subjectInfo && subjectInfo.type !== Content_Types_Enum.TERM)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.SUBJECT_NOT_FOUND_ERROR });
      }
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    //  startedAt < endedAt
    if (startedAt && endedAt && new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.START_TIME_ERROR });
    }

    if (id) {
      // if id exist get termInfo
      const termInfo = await termsRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!termInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await termsRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 项目列表
   * @param {ListTermDto} params
   * @returns {ResultData} 返回listTerm信息
   */
  async listTerm(params: ListTermDto, user: SignInResInfo): Promise<ResultData> {
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
    // get terms
    const [terms, count] = await termsRepository.findAndCount({
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
      return ResultData.ok({ data: { terms: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          terms.map((term) => {
            return term.columnId;
          })
        ),
      },
    });
    const result = terms.map((term) => {
      return {
        id: term.id,
        name: term.name,
        clicks: term.clicks,
        status: term.status,
        updatedAt: term.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === term.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { terms: result, count: count } });
  }
  /**
   * @description 操作项目
   * @param {OperateTermsDto} params 操作项目的相关参数
   * @returns {ResultData} 返回operateTerms信息
   */
  async operateTerms(params: OperateTermsDto, user: SignInResInfo): Promise<ResultData> {
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
    const success = await termsRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await termsRepository.update(
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
   * @description 删除项目
   * @param {RemoveTermsDto} params 删除项目的相关参数
   * @returns {ResultData} 返回removeTerms信息
   */
  async removeTerms(params: RemoveTermsDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await termsRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await termsRepository.update(
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
