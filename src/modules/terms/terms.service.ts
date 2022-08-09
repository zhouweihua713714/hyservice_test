import _, { isArray, isNull } from 'lodash';
import { ResultData } from '@/common/utils/result';
import { Injectable } from '@nestjs/common';

import { SignInResInfo } from '../auth/auth.types';

import { Repository, Like, In, IsNull, Not, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ErrorCode } from '@/common/utils/errorCode';
import { websiteRepository } from '../repository/repository';
import { SaveTermDto } from './terms.dto';
import { User_Types_Enum } from '@/common/enums/common.enum';

@Injectable()
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
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    const result = await websiteRepository.save(params);
    return ResultData.ok({ data: result });
  }
}
