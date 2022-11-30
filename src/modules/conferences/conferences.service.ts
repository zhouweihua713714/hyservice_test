import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  conferencesRepository,
  fieldsRepository,
  userHistoryRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetConferenceDetailDto,
  ListComplexConferenceDto,
  ListConferenceDto,
  ListRecentConferenceDto,
  OperateConferencesDto,
  RecommendConferencesDto,
  RemoveConferencesDto,
  SaveConferenceDto,
} from './conferences.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  Picker_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';
import { dateFormat } from '@/common/utils/dateFormat';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ConferencesService {
  constructor(private readonly usersService: UsersService) {}
  /**
   * @description 获取会议详情
   * @param {GetConferenceDetailDto} params
   * @returns {ResultData} 返回getConferenceDetail信息
   */
  async getConferenceDetail(
    params: GetConferenceDetailDto,
    user: SignInResInfo
  ): Promise<ResultData> {
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
    let userInfo, fields, minorFields, childConferences;
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
    // if conference is parent,then get childConferences
    if (params.flag && conferenceInfo.parentId && conferenceInfo.parentId === '0') {
      childConferences = await conferencesRepository.find({
        where: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
          parentId: conferenceInfo.id,
        },
        select: ['id', 'name', 'conductedAt', 'picker', 'period', 'introduction', 'website'],
        order: {
          conductedAt: 'DESC',
          publishedAt: 'DESC',
        },
      });
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
      childConferences,
    };
    // update clicks
    if (params.flag) {
      await conferencesRepository.update(params.id, { clicks: conferenceInfo.clicks + 1 });
    }
    // if user login then record history
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.CONFERENCE,
      });
    }
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
    return ResultData.ok({ data: result });
  }
  /**
   * @description 会议列表
   * @param {ListConferenceDto} params
   * @returns {ResultData} 返回listConference信息
   */
  async listConference(params: ListConferenceDto, user: SignInResInfo): Promise<ResultData> {
    const { columnId, name, status, page, size } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    let statusCondition;
    let columnCondition;
    let nameCondition;
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
    if (name) {
      nameCondition = {
        name: Like(`%${name}%`),
      };
    }
    // get conferences
    const [conferences, count] = await conferencesRepository.findAndCount({
      where: {
        ...statusCondition,
        ...columnCondition,
        ...nameCondition,
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
  /**
   * @description 会议列表(c端)
   * @param {ListComplexConferenceDto} params会议列表参数
   * @returns {ResultData} 返回listComplexConference信息
   */
  async listComplexConference(
    params: ListComplexConferenceDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { conductedAt, picker, endedAt, keyword, page, size } = params;
    // get basic condition
    const month = 'yyyy-mm';
    const date = 'yyyy-mm-dd';
    let conductedAtDateString;
    let endedAtDateString;
    let keywords;
    let basicCondition =
      'conferences.enabled = true and conferences.deletedAt is null and conferences.status =:status and conferences.parentId =:parentId';
    if (picker && picker === Picker_Enum.Year && conductedAt) {
      basicCondition += ' and extract(year from conferences.conductedAt) =:year';
    }
    if (picker && picker === Picker_Enum.Date && conductedAt) {
      conductedAtDateString = dateFormat(conductedAt, Picker_Enum.Date);
      basicCondition += ` and to_char(conferences.conductedAt,'${date}') >=:conductedAt`;
    }
    if (picker && picker === Picker_Enum.Date && endedAt) {
      endedAtDateString = dateFormat(endedAt, Picker_Enum.Date);
      basicCondition += ` and to_char(conferences.conductedAt,'${date}') <=:endedAt`;
    }
    if (picker && picker === Picker_Enum.Month && conductedAt) {
      conductedAtDateString = dateFormat(conductedAt, Picker_Enum.Month);
      basicCondition += ` and to_char(conferences.conductedAt,'${month}') >=:conductedAt`;
    }
    if (picker && picker === Picker_Enum.Month && endedAt) {
      endedAtDateString = dateFormat(endedAt, Picker_Enum.Month);
      basicCondition += ` and to_char(conferences.endedAt,'${month}') <=:endedAt`;
    }
    if (keyword) {
      // get keywords
      keywords = `%${keyword.replace(/;/g, '%;%')}%`.split(';');
      basicCondition += ' and conferences.name like any (ARRAY[:...keyword])';
    }
    // get conferences and count
    const [conferences, count] = await conferencesRepository
      .createQueryBuilder('conferences')
      .select([
        'conferences.id',
        'conferences.name',
        'conferences.conductedAt',
        'conferences.endedAt',
        'conferences.picker',
        'conferences.location',
        'conferences.period',
        'conferences.introduction',
        'conferences.field',
        'conferences.minorField',
        'conferences.website',
        'conferences.coverUrl',
      ])
      .where(`${basicCondition}`, {
        status: Content_Status_Enum.ACTIVE,
        year: conductedAt ? new Date(conductedAt).getFullYear() : undefined,
        conductedAt: conductedAtDateString,
        endedAt: endedAtDateString,
        keyword: keywords,
        parentId: '0',
      })
      .orderBy('conferences.conductedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('conferences.publishedAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    if (count === 0) {
      return ResultData.ok({ data: { conferences: [], count: count } });
    }
    // get fields
    let periodIds;
    conferences.map((data) => {
      periodIds = _.union(data.field as string[], periodIds);
      periodIds = _.union(data.minorField as string[], periodIds);
    });
    periodIds = _.uniq(periodIds);
    let fields;
    if (periodIds.length > 0) {
      fields = await fieldsRepository.findBy({
        id: In(periodIds),
        type: Like(`%${Content_Types_Enum.CONFERENCE}%`),
      });
    }
    const result = conferences.map((data) => {
      let fieldInfo;
      let minorFieldInfo;
      if (data.field) {
        fieldInfo = (data.field as string[]).map((data) => {
          return {
            name: _.find(fields, function (o) {
              return o.id === data;
            })
              ? _.find(fields, function (o) {
                  return o.id === data;
                }).name
              : null,
          };
        });
      }
      if (data.minorField) {
        minorFieldInfo = (data.minorField as string[]).map((data) => {
          return {
            name: _.find(fields, function (o) {
              return o.id === data;
            })
              ? _.find(fields, function (o) {
                  return o.id === data;
                }).name
              : null,
          };
        });
      }
      return {
        ...data,
        fieldName: fieldInfo
          ? _.join(
              fieldInfo.map((data) => {
                return data.name;
              }),
              ';'
            )
          : null,
        minorFieldName: minorFieldInfo
          ? _.join(
              minorFieldInfo.map((data) => {
                return data.name;
              }),
              ';'
            )
          : null,
      };
    });
    // 搜索埋点
    await this.usersService.recordUserSearchTimes({
      keywords: keyword?.split(';') || [],
      type: Content_Types_Enum.CONFERENCE,
      userId: user?.id,
      columnId: '0',
    });
    return ResultData.ok({ data: { conferences: result, count: count } });
  }
  /**
   * @description 最近会议TOP4
   * @param {ListRecentConferenceDto} params最近会议TOP4参数
   * @returns {ResultData} 返回listRecentConference信息
   */
  async listRecentConference(
    params: ListRecentConferenceDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    // get conferences and count
    const [conferences, count] = await conferencesRepository
      .createQueryBuilder('conferences')
      .select([
        'conferences.id',
        'conferences.name',
        'conferences.conductedAt',
        'conferences.endedAt',
        'conferences.picker',
        'conferences.location',
        'conferences.period',
        'conferences.coverUrl',
      ])
      .where(
        'conferences.enabled = true and conferences.deletedAt is null and conferences.status =:status and conferences.parentId !=:parentId',
        {
          parentId: '0',
          status: Content_Status_Enum.ACTIVE,
        }
      )
      .orderBy('conferences.conductedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('conferences.publishedAt', 'DESC')
      .take(4)
      .getManyAndCount();
    if (count === 0) {
      return ResultData.ok({ data: { conferences: [] } });
    }
    return ResultData.ok({ data: { conferences: conferences } });
  }
  /**
   * @description 推荐会议
   * @param {RecommendConferencesDto} params 推荐的相关参数
   * @returns {ResultData} 返回recommendConferences信息
   */
  async recommendConferences(
    params: RecommendConferencesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    const conferenceInfo = await conferencesRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    // get columns
    const columns = await columnsRepository.find({
      where: {
        parentId: In(['column_06']),
        isHide: 0,
      },
      select: ['id', 'name'],
    });
    const field = conferenceInfo?.field as string[];
    const minorField = conferenceInfo?.minorField as string[];
    let conferences;
    let basicCondition =
      'conferences.enabled = true and conferences.deletedAt is null and conferences.status =:status and conferences.parentId =:parentId';
    if (conferenceInfo) {
      basicCondition += ' and conferences.id !=:id';
    }
    // if columns is hide, related data is hide
    if (columns && columns.length > 0) {
      basicCondition += ' and conferences.columnId in (:...columnIds)';
    }
    if (columns && columns.length === 0) {
      // eslint-disable-next-line quotes
      basicCondition += ` and conferences.columnId ='-1'`;
    }
    if (field && field.length > 0) {
      conferences = await conferencesRepository
        .createQueryBuilder('conferences')
        .select(['conferences.id', 'conferences.name', 'conferences.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: conferenceInfo?.id,
          columnIds: columns.map((data) => {
            return data.id;
          }),
          parentId: '0',
        })
        .andWhere('conferences.field::jsonb ?| ARRAY[:...field]', {
          field: field,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(8)
        .getMany();
    }
    let idsCondition = '';
    // if conferences count < 8 then minorField recommend
    if (conferences && conferences.length < 8) {
      if (conferences.length > 0) {
        idsCondition = ' and id not in (:...ids)';
      }
      if (minorField && minorField.length > 0) {
        const newConferences = await conferencesRepository
          .createQueryBuilder('conferences')
          .select(['conferences.id', 'conferences.name', 'conferences.columnId'])
          .where(`${basicCondition}${idsCondition}`, {
            status: Content_Status_Enum.ACTIVE,
            id: conferenceInfo?.id,
            ids: conferences.map((data) => {
              return data.id;
            }),
            columnIds: columns.map((data) => {
              return data.id;
            }),
            parentId: '0',
          })
          .andWhere('conferences.minor_field::jsonb ?| ARRAY[:...minorField]', {
            minorField: minorField,
          })
          .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
          .take(8 - conferences.length)
          .getMany();
        conferences = _.unionBy(conferences, newConferences, 'id');
      }
    }
    // if conferences count < 8 then all conference recommend
    if (!conferenceInfo || !conferences || (conferences && conferences.length < 8)) {
      let size = 8;
      if (conferences) {
        size = size - conferences.length;
      }
      const newConferences = await conferencesRepository
        .createQueryBuilder('conferences')
        .select(['conferences.id', 'conferences.name', 'conferences.columnId'])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: conferenceInfo?.id,
          ids: conferences
            ? conferences.map((data) => {
                return data.id;
              })
            : undefined,
          columnIds: columns.map((data) => {
            return data.id;
          }),
          parentId: '0',
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      conferences = _.unionBy(conferences, newConferences, 'id');
    }
    const result = conferences.map((conference) => {
      return {
        ...conference,
        columnName: _.find(columns, function (o) {
          return o.id === conference.columnId;
        })?.name,
      };
    });
    return ResultData.ok({
      data: { conferences: result ? result : [] },
    });
  }
}
