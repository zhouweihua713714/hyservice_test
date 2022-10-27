import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../../auth/auth.types';
import { userKeywordStatisticsRepository } from '@/modules/repository/repository';

export class UserKeywordsService {
  /**
   * @description 获取用户搜索词云(排名前60个)
   * @returns {ResultData} 返回60个关键字
   */
  async listUserSearchKeywords(user: SignInResInfo): Promise<ResultData> {
    const keywords = await userKeywordStatisticsRepository
        .createQueryBuilder('userKeywordStatistics')
        .select('COUNT(userKeywordStatistics.search)', 'count')
        .addSelect('userKeywordStatistics.keyword', 'keyword')
        .where('userKeywordStatistics.userId = :userId', { userId: user.id })
        .groupBy('userKeywordStatistics.keyword')
        .orderBy('count', 'DESC')
        .limit(60)
        .getRawMany();
    return ResultData.ok({ data: { keywords }});
  }
}
