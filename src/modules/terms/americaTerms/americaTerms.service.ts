import { Content_Status_Enum, Content_Types_Enum } from '@/common/enums/common.enum';
import { ResultData } from '@/common/utils/result';
import { AmericaTerms } from '@/entities/AmericaTerms.entity';
import { SignInResInfo } from '@/modules/auth/auth.types';
import { americaTermsRepository } from '@/modules/repository/repository';
import { UsersService } from '@/modules/users/users.service';
import _ from 'lodash';
import { Brackets } from 'typeorm';
import { GetAmericaTermAmountByKeywordsDto, ListComplexAmericaTermDto } from './americaTerms.dto';
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
      .addGroupBy('keywords.name')
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


  /**
   * @description 美国项目列表(c端)
   * @param { ListComplexAmericaTermDto } params
   * @returns {ResultData} 返回listComplexAmericaTerm信息
   */
  async listComplexAmericaTerm(params: ListComplexAmericaTermDto, user: SignInResInfo): Promise<ResultData> {
      const { keyword, organization, nsfDirectorate, year, principalInvestigator, page, size } = params;
      // get basic condition
      let basicCondition =
        'americaTerms.enabled = true and americaTerms.deletedAt is null and americaTerms.status =:status';
      if (organization) {
        basicCondition += ' and americaTerms.organization like :organization';
      }
      if (nsfDirectorate) {
        basicCondition += ' and americaTerms.nsfDirectorate = :nsfDirectorate';
      }
      if (year) {
        basicCondition += ' and americaTerms.year = :year';
      }
      if (principalInvestigator) {
        basicCondition += ' and americaTerms.principalInvestigator like :principalInvestigator';
      }
      // get americaTerms and count
      let americaTerms: AmericaTerms[];
      let count: number;
      if (keyword) {
        // get keywords
        const keywords = `%${keyword.replace(/;/g, '%;%')}%`.split(';');
        [americaTerms, count] = await americaTermsRepository
          .createQueryBuilder('americaTerms')
          .select([
            'americaTerms.awardNumber',
            'americaTerms.title',
            'americaTerms.startDate',
            'americaTerms.endDate',
            'americaTerms.organization',
            'americaTerms.principalInvestigator',
            'americaTerms.awardedAmountToDate',
            'americaTerms.nsfDirectorate',
          ])
          .innerJoin('AmericaTermKeywords', 'americaTermKeywords', 'americaTerms.awardNumber = americaTermKeywords.awardNumber')
          .where(`${basicCondition}`, {
            status: Content_Status_Enum.ACTIVE,
            organization: `%${organization}%`,
            nsfDirectorate,
            year: new Date(year).getFullYear(),
            principalInvestigator: `%${principalInvestigator}%`,
          })
          .andWhere(
            new Brackets((qb) => {
              qb.where('americaTerms.title like any (ARRAY[:...keyword])', { keyword: keywords }).orWhere(
                'LOWER(americaTermKeywords.name) like any (ARRAY[:...keyword])',
                { keyword: keywords }
              );
            })
          )
          .orderBy('americaTerms.startDate', 'DESC','NULLS LAST')
          .addOrderBy('americaTerms.awardNumber', 'ASC')
          .skip((page - 1) * size)
          .take(size)
          .getManyAndCount();
      } else {
        [americaTerms, count] = await americaTermsRepository
          .createQueryBuilder('americaTerms')
          .select([
            'americaTerms.awardNumber',
            'americaTerms.title',
            'americaTerms.startDate',
            'americaTerms.endDate',
            'americaTerms.organization',
            'americaTerms.principalInvestigator',
            'americaTerms.awardedAmountToDate',
            'americaTerms.nsfDirectorate',
          ])
          .where(`${basicCondition}`, {
            status: Content_Status_Enum.ACTIVE,
            organization: `%${organization}%`,
            nsfDirectorate,
            year: new Date(year).getFullYear(),
            principalInvestigator: `%${principalInvestigator}%`,
          })
          .orderBy('americaTerms.startDate', 'DESC','NULLS LAST')
          .addOrderBy('americaTerms.awardNumber', 'ASC')
          .skip((page - 1) * size)
          .take(size)
          .getManyAndCount();
      }
      // 搜索埋点
      await new UsersService().recordUserSearchTimes({
        keywords: keyword?.split(';') || [],
        type: Content_Types_Enum.TERM,
        userId: user?.id,
        columnId: 'column_01_04',
      });
      return ResultData.ok({ data: { americaTerms, count } });
  }
}
