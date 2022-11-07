import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import { keywordsRepository, websiteRepository } from '../repository/repository';
import { GetHomepageSearchResultByKeywordDto, SetHomepageDto } from './homepage.dto';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { QueryRunner } from 'typeorm';

export class HomepageService {
  /**
   * @description 获取首页配置
   * @param {} params
   * @returns {ResultData} 返回getResourceSources信息
   */
  async getHomepageConfig(): Promise<ResultData> {
    const data = await websiteRepository.find({ take: 1 });
    if (data.length > 0) {
      return ResultData.ok({ data: { ...data[0] } });
    } else {
      return ResultData.ok({ data: {} });
    }
  }
  /**
   * @description 设置首页
   * @param {SetHomepageDto} params 创建资源的相关参数
   * @returns {ResultData} 返回setHomepage信息
   */
  async setHomepage(params: SetHomepageDto, user: SignInResInfo): Promise<ResultData> {
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    const result = await websiteRepository.save(params);
    return ResultData.ok({ data: result });
  }

  /**
   * @description 获取首页热搜关键词
   * @param {GeHotKeywordsDto}获取首页热搜关键词 params
   * @returns {ResultData} 返回getHomepageHotKeywords信息
   */
  async getHomepageHotKeywords(params: any): Promise<ResultData> {
    const data = await keywordsRepository
      .createQueryBuilder('keywords')
      .distinctOn(['keywords.name', 'keywords.search', 'keywords.frequency', 'keywords.type'])
      .where('keywords.type != :type', { type: Content_Types_Enum.PATENT })
      .orderBy('keywords.search', 'DESC', 'NULLS LAST')
      .addOrderBy('keywords.frequency', 'DESC')
      .addOrderBy('keywords.name', 'ASC')
      .getMany();
    const result = _.uniqBy(data, 'name').slice(0, 10);
    return ResultData.ok({ data: { keywords: result } });
  }

  /**
   * @description 首页搜索返回关键词列表
   * @param {GetHomepageSearchResultByKeywordDto } params
   * @returns {ResultData} 返回getHomepageSearchResultByKeyword信息
   */
  async getHomepageSearchResultByKeyword(
    params: GetHomepageSearchResultByKeywordDto
  ): Promise<ResultData> {
    const { keyword } = params;
    const data = await keywordsRepository
      .createQueryBuilder('keywords')
      .select(['keywords.name', 'keywords.search', 'keywords.frequency', 'keywords.type'])
      .distinct(true)
      .where('keywords.type != :type and name like :keyword', {
        type: Content_Types_Enum.PATENT,
        keyword: `%${keyword.toLowerCase()}%`,
      })
      .orderBy('keywords.search', 'DESC', 'NULLS LAST')
      .addOrderBy('keywords.frequency', 'DESC')
      .addOrderBy('keywords.name', 'ASC')
      .getMany();
    const result = _.uniqBy(data, 'name').slice(0, 8);
    return ResultData.ok({ data: { keywords: result } });
  }
}
