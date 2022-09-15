import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import { ListHistoryDto } from './userHistory.dto';
import {
  conferencesRepository,
  institutionsRepository,
  patentsRepository,
  periodicalsRepository,
  policiesRepository,
  termsRepository,
  treatisesRepository,
  userHistoryRepository,
} from '@/modules/repository/repository';
import { In } from 'typeorm';
import { Content_Types_Enum } from '@/common/enums/common.enum';

export class UserHistoryService {
  /**
   * @description 用户浏览历史
   * @param {ListHistoryDto} params 用户浏览历史的相关参数
   * @returns {ResultData} 返回listHistory信息
   */
  async listHistory(params: ListHistoryDto, user: SignInResInfo): Promise<ResultData> {
    const { page, size } = params;
    // get user history
    const [userHistory, count] = await userHistoryRepository.findAndCount({
      where: {
        userId: user.id,
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        createdAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { userHistory: [], count: count } });
    }
    // get ids by type
    const { term, treatise, policy, periodical, patent, institution, conference } = _.groupBy(
      userHistory,
      'type'
    );
    let terms;
    let treatises;
    let policies;
    let periodicals;
    let patents;
    let institutions;
    let conferences;
    if (term) {
      terms = await termsRepository.findBy({
        id: In(
          term.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    if (treatise) {
      treatises = await treatisesRepository.findBy({
        id: In(
          treatise.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    if (policy) {
      policies = await policiesRepository.findBy({
        id: In(
          policy.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    if (patent) {
      patents = await patentsRepository.findBy({
        id: In(
          patent.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    if (periodical) {
      periodicals = await periodicalsRepository.findBy({
        id: In(
          periodical.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    if (institution) {
      institutions = await institutionsRepository.findBy({
        id: In(
          institution.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    if (conference) {
      conferences = await conferencesRepository.findBy({
        id: In(
          conference.map((data) => {
            return data.relatedId;
          })
        ),
      });
    }
    // get related's title
    const result = userHistory.map((data) => {
      let title;
      switch (data.type) {
        case Content_Types_Enum.TERM:
          title = _.find(terms, function (o) {
            return o.id === data.relatedId;
          })?.name;
          break;
        case Content_Types_Enum.TREATISE:
          title = _.find(treatises, function (o) {
            return o.id === data.relatedId;
          })?.title;
          break;
        case Content_Types_Enum.POLICY:
          title = _.find(policies, function (o) {
            return o.id === data.relatedId;
          })?.name;
          break;
        case Content_Types_Enum.PERIODICAL:
          title = _.find(periodicals, function (o) {
            return o.id === data.relatedId;
          })?.name;
          break;
        case Content_Types_Enum.INSTITUTION:
          title = _.find(institutions, function (o) {
            return o.id === data.relatedId;
          })?.name;
          break;
        case Content_Types_Enum.PATENT:
          title = _.find(patents, function (o) {
            return o.id === data.relatedId;
          })?.title;
          break;
        default:
          title = _.find(conferences, function (o) {
            return o.id === data.relatedId;
          })?.name;
          break;
      }
      return {
        ...data,
        title: title,
      };
    });
    return ResultData.ok({ data: { userHistory: result, count: count } });
  }
}
