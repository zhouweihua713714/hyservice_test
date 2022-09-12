import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import { universitiesRepository, usersRepository } from '../repository/repository';
import { ModifyUserInfoDto } from './users.dto';
import { User_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';

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
}
