import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  keywordsRepository,
  universitiesRepository,
  userKeywordStatisticsRepository,
  usersRepository,
} from '../repository/repository';
import { ModifyUserInfoDto } from './users.dto';
import { User_Status_Enum } from '@/common/enums/common.enum';
import { In } from 'typeorm';
export class UsersService {
  /**
   * @description 获取用户详情
   * @param {} params
   * @returns {ResultData} 返回getUserDetail信息
   */
  async getUserDetail(user: SignInResInfo): Promise<ResultData> {
    const userInfo = await usersRepository.findOneBy({
      id: user.id,
      status: User_Status_Enum.Enabled,
    });
    if (!userInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_FOUND_ERROR });
    }
    let universityInfo;
    if (userInfo.university) {
      universityInfo = await universitiesRepository.findOneBy({
        id: userInfo.university,
      });
    }
    const result = {
      universityName: universityInfo ? universityInfo.name : null,
      ...userInfo,
    };
    return ResultData.ok({ data: result });
  }
  /**
   * @description 编辑用户基本资料
   * @param {ModifyUserInfoDto} params 编辑用户基本资料的相关参数
   * @returns {ResultData} 返回modifyUserInfo信息
   */
  async modifyUserInfo(params: ModifyUserInfoDto, user: SignInResInfo): Promise<ResultData> {
    const { id, university } = params;
    // if not self, then throw error
    if (user.id !== id) {
      return ResultData.fail({ ...ErrorCode.USERS.USER_NOT_PERMITTED_ERROR });
    }
    // if university not found in database, then throw error
    if (university) {
      const universityInfo = await universitiesRepository.findOneBy({
        id: university,
      });
      if (!universityInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.UNIVERSITY_NOT_FOUND_ERROR });
      }
    }
    await usersRepository.save(params);
    return ResultData.ok({ data: {} });
  }

  /**
   * @description 记录用户关键词搜索次数
   * @param {ModifyUserInfoDto} params
   */
  async recordUserSearchTimes(params: {
    keywords: string[];
    type: string;
    userId: string;
    columnId: string;
  }): Promise<void> {
    // 查询关键字是否存在
    const { keywords, type, userId, columnId } = params;
    const [existingKeywords, userExistingKeywords] = await Promise.all([
      keywordsRepository.find({
        where: {
          type,
          name: In(keywords),
        },
      }),
      userKeywordStatisticsRepository.find({
        where: {
          userId,
          keyword: In(keywords),
          columnId,
        },
      }),
    ]);
    const updateKeywordsStatistics: any[] = [];
    if (!_.isEmpty(existingKeywords)) {
      for (let i = 0; i < existingKeywords.length; i++) {
        const keyword = existingKeywords[i].name;
        updateKeywordsStatistics.push(
          keywordsRepository.increment({ name: keyword, type }, 'search', 1)
        );
        if (userId) {
          // 此处不加锁，少量数据覆盖不影响业务
          if (_.findIndex(userExistingKeywords, { keyword }) > -1) {
            updateKeywordsStatistics.push(
              userKeywordStatisticsRepository.increment({ userId, keyword, columnId }, 'search', 1)
            );
          } else {
            updateKeywordsStatistics.push(
              userKeywordStatisticsRepository.save({ userId, keyword, columnId, search: 1 })
            );
          }
        }
      }
      // 用户统计埋点
      await Promise.all(updateKeywordsStatistics);
    }
  }
}
