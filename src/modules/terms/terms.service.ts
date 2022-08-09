import _, { isArray, isNull } from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';

import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  subjectsRepository,
  termsRepository,
  termTypesRepository,
  websiteRepository,
} from '../repository/repository';
import { SaveTermDto } from './terms.dto';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';

export class TermsService {
  /**
   * @description 获取首页配置
   * @param {} params
   * @returns {ResultData} 返回getResourceSources信息
   */
  async getTermsConfig(): Promise<ResultData> {
    const data = await websiteRepository.find({ take: 1 });
    if (data.length > 0) {
      return ResultData.ok({ data: { ...data[0] } });
    } else {
      return ResultData.ok({ data: {} });
    }
  }
  /**
   * @description 设置首页
   * @param {SaveTermDto} params 创建资源的相关参数
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
