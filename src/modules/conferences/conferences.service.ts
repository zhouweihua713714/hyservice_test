import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  conferencesRepository,
  fieldsRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetConferenceDetailDto,
  ListConferenceDto,
  OperateConferencesDto,
  RemoveConferencesDto,
  SaveConferenceDto,
} from './conferences.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';

export class ConferencesService {
  /**
   * @description 获取会议详情
   * @param {GetConferenceDetailDto} params
   * @returns {ResultData} 返回getConferenceDetail信息
   */
  async getConferenceDetail(params: GetConferenceDetailDto): Promise<ResultData> {
    const conferenceInfo = await conferencesRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!conferenceInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: conferenceInfo.columnId });
    // get necessary data
    let userInfo;
    let fields;
    let minorFields;
    if (conferenceInfo.field) {
      fields = await fieldsRepository.findBy({ id: In(conferenceInfo.field as string[]) });
    }
    if (conferenceInfo.minorField) {
      minorFields = await fieldsRepository.findBy({
        id: In(conferenceInfo.minorField as string[]),
      });
    }
    if (conferenceInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: conferenceInfo.ownerId });
    }
    const result = {
      fieldName: fields
        ? _.join(
            fields.map((field) => {
              return field.name;
            }),
            ';'
          )
        : null,
      minorFieldName: minorFields
        ? _.join(
            minorFields.map((minorField) => {
              return minorField.name;
            }),
            ';'
          )
        : null,
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...conferenceInfo,
    };
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存会议
   * @param {SaveConferenceDto} params 保存会议的相关参数
   * @returns {ResultData} 返回saveConference信息
   */
  async saveConference(params: SaveConferenceDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, columnId, field, minorField } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    // if field not found in database, then throw error
    if (field) {
      const fields = await fieldsRepository.findBy({
        id: In(field),
        isMain: 1,
        type: Like(`%${Content_Types_Enum.CONFERENCE}%`),
      });
      if (!fields || (fields && fields.length !== field.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.FILED_NOT_FOUND_ERROR });
      }
    }
    // if field not found in database, then throw error
    if (minorField) {
      const fields = await fieldsRepository.findBy({
        id: In(minorField),
        isMain: 0,
        type: Like(`%${Content_Types_Enum.CONFERENCE}%`),
      });
      if (!fields || (fields && fields.length !== minorField.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.MINOR_FILED_NOT_FOUND_ERROR });
      }
    }
    if (id) {
      // if id exist get conferenceInfo
      const conferenceInfo = await conferencesRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!conferenceInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await conferencesRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    console.log(result);
    return ResultData.ok({ data: result });
  }
  /**
   * @description 会议列表
   * @param {ListConferenceDto} params
   * @returns {ResultData} 返回listConference信息
   */
  async listConference(params: ListConferenceDto, user: SignInResInfo): Promise<ResultData> {
    const { columnId, title, status, page, size } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    let statusCondition;
    let columnCondition;
    let titleCondition;
    if (status) {
      statusCondition = {
        status: status,
      };
    }
    if (columnId) {
      columnCondition = {
        columnId: columnId,
      };
    }
    if (title) {
      titleCondition = {
        title: Like(`%${title}%`),
      };
    }
    // get conferences
    const [conferences, count] = await conferencesRepository.findAndCount({
      where: {
        ...statusCondition,
        ...columnCondition,
        ...titleCondition,
        enabled: true,
        deletedAt: IsNull(),
      },
      select: ['id', 'columnId', 'name', 'clicks', 'status', 'updatedAt'],
      skip: (page - 1) * size,
      take: size,
      order: {
        status: 'DESC',
        updatedAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { conferences: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          conferences.map((conference) => {
            return conference.columnId;
          })
        ),
      },
    });
    const result = conferences.map((conference) => {
      return {
        id: conference.id,
        name: conference.name,
        clicks: conference.clicks,
        status: conference.status,
        updatedAt: conference.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === conference.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { conferences: result, count: count } });
  }
  /**
   * @description 操作会议
   * @param {OperateConferencesDto} params 操作会议的相关参数
   * @returns {ResultData} 返回operateConferences信息
   */
  async operateConferences(
    params: OperateConferencesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids, status } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    let statusCondition;
    if (status === Content_Status_Enum.ACTIVE) {
      statusCondition = {
        status: Content_Status_Enum.READY,
      };
    }
    if (status === Content_Status_Enum.READY) {
      statusCondition = {
        status: Content_Status_Enum.ACTIVE,
      };
    }
    const success = await conferencesRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await conferencesRepository.update(
      success.map((data) => {
        return data.id;
      }),
      {
        status: status,
        publishedAt: status === Content_Status_Enum.ACTIVE ? new Date() : undefined,
      }
    );
    const succeed = affected.affected ? affected.affected : 0;
    return ResultData.ok({
      data: { succeed: succeed, failed: ids.length - succeed },
    });
  }
  /**
   * @description 删除会议
   * @param {RemoveConferencesDto} params 删除会议的相关参数
   * @returns {ResultData} 返回removeConferences信息
   */
  async removeConferences(params: RemoveConferencesDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await conferencesRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await conferencesRepository.update(
      success.map((data) => {
        return data.id;
      }),
      {
        deletedAt: new Date(),
        enabled: false,
      }
    );
    const succeed = affected.affected ? affected.affected : 0;
    return ResultData.ok({
      data: { succeed: succeed, failed: ids.length - succeed },
    });
  }
}
