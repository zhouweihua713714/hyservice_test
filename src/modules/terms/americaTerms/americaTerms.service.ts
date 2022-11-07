import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ResultData } from '@/common/utils/result';
import { americaTermsRepository } from '@/modules/repository/repository';
import _ from 'lodash';
import { GetAmericaTermAmountByKeywordsDto } from './americaTerms.dto';
import { AmericaTermAmountByKeywordsInfo, AmericaTermOverviewInfo } from './americaTerms.types';

export class AmericaTermsService {

  /**
   * @description 美国项目概览
   * @returns { ResultData } GetAmericaTermOverviewResult 概览信息
   */
   async getAmericaTermOverview(): Promise<ResultData> {
    const [termCounts, amounts] = await Promise.all([
      americaTermsRepository.createQueryBuilder('americaTerms')
      .select('americaTerms.year', 'year')
      .addSelect('COUNT(americaTerms.awardNumber)', 'termCount')
      .andWhere('americaTerms.enabled =:enabled', {enabled: true})
      .andWhere('americaTerms.status=:status', {status: Content_Status_Enum.ACTIVE})
      .andWhere('americaTerms.deletedAt is null')
      .groupBy('americaTerms.year')
      .getRawMany(),
      americaTermsRepository.createQueryBuilder('americaTerms')
      .select('americaTerms.year', 'year')
      .addSelect('SUM(americaTerms.awardedAmountToDate)', 'amount')
      .andWhere('americaTerms.enabled =:enabled', {enabled: true})
      .andWhere('americaTerms.status=:status', {status: Content_Status_Enum.ACTIVE})
      .andWhere('americaTerms.deletedAt is null')
      .groupBy('americaTerms.year')
      .getRawMany(),
    ]);
    const americaTerms: AmericaTermOverviewInfo[] = [];
    const thisYear = (new Date()).getFullYear();
    for (let index = 2015; index <= thisYear; index++) {
      const termCountInfo = _.find(termCounts, {year: String(index)});
      const termCount = Number(termCountInfo?.termCount) || 0;
      const amountInfo = _.find(amounts, {year: String(index)});
      const amount = Number(amountInfo?.amount) || 0;
      americaTerms.push({
        year: index,
        amount,
        termCount
      });
    }
    return ResultData.ok({data: { americaTerms }});
  }

  /**
   * @description 美国项目立项单位分布
   * @returns { ResultData } GetAmericaTermDistributionResult 美国项目立项单位分布信息
   */
  async getAmericaTermDistribution(): Promise<ResultData> {
    const americaTerms = await americaTermsRepository.createQueryBuilder('americaTerms')
    .select('americaTerms.state', 'state')
    .addSelect('COUNT(americaTerms.awardNumber)::int as count')
    .andWhere('americaTerms.enabled =:enabled', {enabled: true})
    .andWhere('americaTerms.status=:status', {status: Content_Status_Enum.ACTIVE})
    .andWhere('americaTerms.deletedAt is null')
    .groupBy('americaTerms.state')
    .getRawMany();
    return ResultData.ok({data: { americaTerms }});
  }

  /**
   * @description 三个学部热力图
   * @params {GetAmericaTermAmountByKeywordsDto} params
   * @returns {ResultData} GetAmericaTermAmountByKeywordsResult 每个关键字金额分布
   */
  async getAmericaTermAmountByKeywords(params: GetAmericaTermAmountByKeywordsDto): Promise<ResultData> {
    const [amounts, keywords] = await Promise.all([
      americaTermsRepository.createQueryBuilder('americaTerms')
      .select('keywords.name', 'keyword')
      .addSelect('americaTerms.year ::int as year')
      .addSelect('SUM(americaTerms.awardedAmountToDate) ::int as amount')
      .innerJoin('AmericaTermKeywords', 'keywords', 'americaTerms.awardNumber = keywords.awardNumber')
      .andWhere('americaTerms.enabled =:enabled', {enabled: true})
      .andWhere('americaTerms.status=:status', {status: Content_Status_Enum.ACTIVE})
      .andWhere('americaTerms.deletedAt is null')
      .andWhere('americaTerms.nsfDirectorate =:nsfDirectorate', {nsfDirectorate: params.nsfDirectorate})
      .groupBy('year')
      .addGroupBy('keyword')
      .getRawMany(),
      americaTermsRepository.createQueryBuilder('americaTerms')
      .select('DISTINCT keywords.name', 'keyword')
      .innerJoin('AmericaTermKeywords', 'keywords', 'americaTerms.awardNumber = keywords.awardNumber')
      .andWhere('americaTerms.enabled =:enabled', {enabled: true})
      .andWhere('americaTerms.status=:status', {status: Content_Status_Enum.ACTIVE})
      .andWhere('americaTerms.deletedAt is null')
      .andWhere('americaTerms.nsfDirectorate =:nsfDirectorate', {nsfDirectorate: params.nsfDirectorate})
      .orderBy('keywords.name', 'ASC')
      .getRawMany(),
    ]);
    const americaTerms: AmericaTermAmountByKeywordsInfo[] = [];
    const thisYear = (new Date()).getFullYear();
    if (keywords && keywords.length > 0) {
      for (let index = 2015; index <= thisYear; index++) {
        for (let i = 0; i < keywords.length; i++) {
          const keywordInfo = keywords[i];
          const amountInfo = _.find(amounts, { year: index, keyword: keywordInfo.keyword });
          if (!_.isEmpty(amountInfo)) {
            americaTerms.push(amountInfo);
          }
          else { // 补0
            americaTerms.push({
              year: index,
              keyword: keywordInfo.keyword,
              amount: 0
            });
          }
        }
      }
    }
    return ResultData.ok({data: { americaTerms }});
  }

  /**
   * @description 热门研究单位
   * @returns {ResultData} GetAmericaTermHotOrganizationListResult
   */
   async getAmericaTermHotOrganizationList(): Promise<ResultData> {
    const americaTerms = await americaTermsRepository.createQueryBuilder('americaTerms')
    .select('americaTerms.organization', 'organization')
    .addSelect('COUNT(americaTerms.awardNumber)::int as count')
    .andWhere('americaTerms.enabled =:enabled', {enabled: true})
    .andWhere('americaTerms.status=:status', {status: Content_Status_Enum.ACTIVE})
    .andWhere('americaTerms.deletedAt is null')
    .groupBy('americaTerms.organization')
    .orderBy('americaTerms.organization', 'DESC')
    .limit(10)
    .getRawMany();
    return ResultData.ok({data: { americaTerms }});
  }
}
