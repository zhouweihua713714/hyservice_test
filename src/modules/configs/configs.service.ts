import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { Injectable } from '@nestjs/common';

import { SignInResInfo } from '../auth/auth.types';

import { ErrorCode } from '@/common/utils/errorCode';
import {
  articleTypesRepository,
  columnsRepository,
  fieldsRepository,
  keywordsRepository,
  languagesRepository,
  patentTypesRepository,
  patentValidTypesRepository,
  periodicalPeriodsRepository,
  policyTypesRepository,
  subjectsRepository,
  termTypesRepository,
  topicTypesRepository,
  universitiesRepository,
} from '../repository/repository';
import { GetSearchResultByKeywordDto, SetColumnsOrderDto, SetColumnsTypeDto } from './configs.dto';
import { User_Types_Enum } from '@/common/enums/common.enum';
import { Like } from 'typeorm';
@Injectable()
export class ConfigsService {
  /**
   * @description 获取文章类型
   * @param {} params
   * @returns {ResultData} 返回getArticleTypes信息
   */
  async getArticleTypes(): Promise<ResultData> {
    const data = await articleTypesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { articleTypes: data } });
  }
  /**
   * @description 设置栏目状态
   * @param {SetColumnsTypeDto} params
   * @returns {ResultData} 返回setColumnsType信息
   */
  async setColumnsType(params: SetColumnsTypeDto, user: SignInResInfo): Promise<ResultData> {
    const { ids, isHide } = params;
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    const data = await columnsRepository.update(ids, {
      isHide: isHide,
    });
    const success = data.affected ? data.affected : 0;
    return ResultData.ok({ data: { succeed: success, failed: ids.length - success } });
  }
  /**
   * @description 设置栏目排序
   * @param {SetColumnsOrderDto} params
   * @returns {ResultData} 返回setColumnsOrder信息
   */
  async setColumnsOrder(params: SetColumnsOrderDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    const columns: { id: string; sequenceNumber: number }[] = [];
    for (let i = 0; i < ids.length; i++) {
      columns.push({ id: ids[i], sequenceNumber: i + 1 });
    }
    const data = await columnsRepository.save(columns);
    return ResultData.ok({ data: {} });
  }
  /**
   * @description 获取栏目
   * @param {} params
   * @returns {ResultData} 返回getColumns信息
   */
  async getColumns(): Promise<ResultData> {
    const data = await columnsRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { columns: data } });
  }
  /**
   * @description 获取领域数据
   * @param {} params
   * @returns {ResultData} 返回getFields信息
   */
  async getFields(): Promise<ResultData> {
    const data = await fieldsRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { fields: data } });
  }
  /**
   * @description 获取语种数据
   * @param {} params
   * @returns {ResultData} 返回getLanguages信息
   */
  async getLanguages(): Promise<ResultData> {
    const data = await languagesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { languages: data } });
  }
  /**
   * @description 获取专利类型数据
   * @param {} params
   * @returns {ResultData} 返回getPatentTypes信息
   */
  async getPatentTypes(): Promise<ResultData> {
    const data = await patentTypesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { patentTypes: data } });
  }
  /**
   * @description 获取专利有效性类型数据
   * @param {} params
   * @returns {ResultData} 返回getPatentValidTypes信息
   */
  async getPatentValidTypes(): Promise<ResultData> {
    const data = await patentValidTypesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { patentValidTypes: data } });
  }
  /**
   * @description 获取发刊周期数据
   * @param {} params
   * @returns {ResultData} 返回getPeriodicalPeriods信息
   */
  async getPeriodicalPeriods(): Promise<ResultData> {
    const data = await periodicalPeriodsRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { periodicalPeriods: data } });
  }
  /**
   * @description 获取政策类型数据
   * @param {} params
   * @returns {ResultData} 返回getPolicyTypes信息
   */
  async getPolicyTypes(): Promise<ResultData> {
    const data = await policyTypesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { policyTypes: data } });
  }
  /**
   * @description 获取学科分类数据
   * @param {} params
   * @returns {ResultData} 返回getSubjects信息
   */
  async getSubjects(): Promise<ResultData> {
    const data = await subjectsRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { subjects: data } });
  }
  /**
   * @description 获取项目类型数据
   * @param {} params
   * @returns {ResultData} 返回getTermTypes信息
   */
  async getTermTypes(): Promise<ResultData> {
    const data = await termTypesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { termTypes: data } });
  }

  /**
   * @description 获取学校数据
   * @param {} params
   * @returns {ResultData} 返回getUniversities信息
   */
  async getUniversities(): Promise<ResultData> {
    const data = await universitiesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { universities: data } });
  }
  /**
   * @description 获取主题类型数据
   * @param {} params
   * @returns {ResultData} 返回getTopicTypes信息
   */
  async getTopicTypes(): Promise<ResultData> {
    const data = await topicTypesRepository.find({
      order: {
        name: 'ASC',
      },
    });
    return ResultData.ok({ data: { topicTypes: data } });
  }

  /**
   * @description 搜索返回关键词列表
   * @param {GetSearchResultByKeywordDto } params
   * @returns {ResultData} 返回getSearchResultByKeyword信息
   */
  async getSearchResultByKeyword(params: GetSearchResultByKeywordDto): Promise<ResultData> {
    const { keyword, type } = params;
    const data = await keywordsRepository.find({
      where: {
        name: Like(`%${keyword}%`),
        type: type,
      },
      order: {
        name: 'ASC',
      },
      select: ['id', 'name'],
    });
    return ResultData.ok({ data: { keywords: data } });
  }
}
