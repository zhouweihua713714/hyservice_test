import _, { isArray, isNull } from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';

import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  subjectsRepository,
  termsRepository,
  termTypesRepository,
  usersRepository,
  websiteRepository,
} from '../repository/repository';
import { GetTermDetailDto, SaveTermDto } from './terms.dto';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { IsNull } from 'typeorm';

export class TermsService {
  /**
   * @description 获取项目详情
   * @param {GetTermDetailDto} params
   * @returns {ResultData} 返回getTermDetail信息
   */
  async getTermDetail(params: GetTermDetailDto): Promise<ResultData> {
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
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存项目
   * @param {SaveTermDto} params 保存项目的相关参数
   * @returns {ResultData} 返回saveTerm信息
   */
  async saveTerm(params: SaveTermDto, user: SignInResInfo): Promise<ResultData> {
    const { termNumber, columnId, type, subject, startedAt, endedAt } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    const [columnInfo, typeInfo, subjectInfo] = await Promise.all([
      columnsRepository.findOneBy({ id: columnId }),
      termTypesRepository.findOneBy({ id: type }),
      subjectsRepository.findOneBy({ id: subject }),
    ]);
    if (startedAt && endedAt && new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.START_TIME_ERROR });
    }
    // if columnId not found in database, then throw error
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    // if type not found in database, then throw error
    if (!typeInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TERM_TYPE_NOT_FOUND_ERROR });
    }
    // if subject not found in database, then throw error
    if (!subjectInfo || (subjectInfo && subjectInfo.type !== Content_Types_Enum.TERM)) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.SUBJECT_NOT_FOUND_ERROR });
    }
    const result = await termsRepository.save({
      id: termNumber ? termNumber : new Date().getTime().toString(),
      ownerId: user.id,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
}
