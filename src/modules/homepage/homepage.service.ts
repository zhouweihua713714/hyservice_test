import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  americaTermKeywordsRepository,
  columnsRepository,
  keywordsRepository,
  policiesRepository,
  termKeywordsRepository,
  treatiseKeywordsRepository,
  websiteRepository,
} from '../repository/repository';
import { GetHomepageSearchResultByKeywordDto, SetHomepageDto } from './homepage.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like } from 'typeorm';

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
      .where('keywords.type != :type and name like :keyword and keywords.frequency != 0', {
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
  /**
   * @description 首页搜索结果知识图谱
   * @param {GetHomepageSearchResultByKeywordDto } params
   * @returns {ResultData} 返回getHomepageKeywordCharts信息
   */
  async getHomepageKeywordCharts(params: GetHomepageSearchResultByKeywordDto): Promise<ResultData> {
    const { keyword } = params;
    // term
    let termKeywords: { name: string; columnId: string; termId: string; title: string }[] = [],
      treatiseKeywords: { name: string; columnId: string; treatiseId: string; title: string }[] =
        [],
      americaTermKeywords: {
        name: string;
        columnId: string;
        awardNumber: string;
        title: string;
      }[] = [],
      policies: { id: string; name: string; columnId: string }[] = [],
      columns;
    // get columns
    columns = await columnsRepository.find({
      where: {
        parentId: In(['column_01', 'column_02', 'column_04']),
        isHide: 0,
      },
      select: ['id', 'name'],
    });
    [termKeywords, treatiseKeywords, americaTermKeywords, policies] = await Promise.all([
      termKeywordsRepository.find({
        where: {
          name: keyword.toLowerCase(),
          columnId: In(
            columns.map((data) => {
              return data.id;
            })
          ),
        }, // if columns is hide, related data is hide
        select: ['name', 'columnId', 'title', 'termId'],
      }),
      treatiseKeywordsRepository.find({
        where: {
          name: keyword.toLowerCase(),
          columnId: In(
            columns.map((data) => {
              return data.id;
            })
          ),
        },
      }),
      americaTermKeywordsRepository.find({
        where: {
          name: keyword.toLowerCase(),
          columnId: In(
            columns.map((data) => {
              return data.id;
            })
          ),
        },
      }),
      policiesRepository.find({
        where: {
          keyword: Like(`%${keyword.toLowerCase()}%`),
          columnId: In(
            columns.map((data) => {
              return data.id;
            })
          ),
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
        },
        select: ['id', 'name', 'columnId'],
      }),
    ]);
    columns = columns.map((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    });
    // get group by data
    const termGroupByColumnId = _.groupBy(termKeywords, 'columnId');
    const americaTermGroupByColumnId = _.groupBy(americaTermKeywords, 'columnId');
    const treatiseGroupByColumnId = _.groupBy(treatiseKeywords, 'columnId');
    // get data by columnId
    const termColumns = _.uniqBy(termKeywords, 'columnId').map((data) => {
      return {
        id: data.columnId,
        name: _.find(columns, function (o) {
          return o.id === data.columnId;
        }).name,
        count: termGroupByColumnId[data.columnId] ? termGroupByColumnId[data.columnId].length : 0,
        details: termGroupByColumnId[data.columnId]
          ? termGroupByColumnId[data.columnId]
              .map((data) => {
                return {
                  id: data.termId,
                  title: data.title,
                };
              })
              .slice(0, 20)
          : [],
      };
    });
    const americaTermColumns = _.uniqBy(americaTermKeywords, 'columnId').map((data) => {
      return {
        id: data.columnId,
        name: _.find(columns, function (o) {
          return o.id === data.columnId;
        }).name,
        count: americaTermGroupByColumnId[data.columnId]
          ? americaTermGroupByColumnId[data.columnId].length
          : 0,
        details: americaTermGroupByColumnId[data.columnId]
          ? americaTermGroupByColumnId[data.columnId]
              .map((data) => {
                return {
                  id: data.awardNumber,
                  title: data.title,
                };
              })
              .slice(0, 20)
          : [],
      };
    });
    const treatiseColumns = _.uniqBy(treatiseKeywords, 'columnId').map((data) => {
      return {
        id: data.columnId,
        name: _.find(columns, function (o) {
          return o.id === data.columnId;
        }).name,
        count: treatiseGroupByColumnId[data.columnId]
          ? treatiseGroupByColumnId[data.columnId].length
          : 0,
        details: treatiseGroupByColumnId[data.columnId]
          ? treatiseGroupByColumnId[data.columnId]
              .map((data) => {
                return {
                  id: data.treatiseId,
                  title: data.title,
                };
              })
              .slice(0, 20)
          : [],
      };
    });
    const policyColumns = _.uniqBy(policies, 'columnId').map((data) => {
      return {
        id: data.columnId,
        name: _.find(columns, function (o) {
          return o.id === data.columnId;
        }).name,
        count: policies.length,
        details: policies
          .map((data) => {
            return {
              id: data.id,
              title: data.name,
            };
          })
          .slice(0, 20),
      };
    });
    const result = {
      termColumns: _.unionBy(termColumns, americaTermColumns, 'id'),
      treatiseColumns,
      policyColumns: policyColumns,
    };
    return ResultData.ok({ data: { ...result } });
  }
}
