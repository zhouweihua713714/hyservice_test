import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ResultData } from '@/common/utils/result';
import { americaTermsRepository } from '@/modules/repository/repository';
import _ from 'lodash';
import { AmericaTermOverviewInfo } from './americaTerms.types';

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
}
