import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  languagesRepository,
  periodicalPeriodsRepository,
  periodicalsRepository,
  subjectsRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetPeriodicalDetailDto,
  ListPeriodicalDto,
  OperatePeriodicalsDto,
  RemovePeriodicalsDto,
  SavePeriodicalDto,
} from './periodicals.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  Peking_Unit_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';

export class PeriodicalsService {
  /**
   * @description 获取期刊详情
   * @param {GetPeriodicalDetailDto} params
   * @returns {ResultData} 返回getPeriodicalDetail信息
   */
  async getPeriodicalDetail(params: GetPeriodicalDetailDto): Promise<ResultData> {
    const periodicalInfo = await periodicalsRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!periodicalInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }

    return ResultData.ok({ data: periodicalInfo });
  }
  /**
   * @description 保存期刊
   * @param {SavePeriodicalDto} params 保存期刊的相关参数
   * @returns {ResultData} 返回savePeriodical信息
   */
  async savePeriodical(params: SavePeriodicalDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, type, columnId, language, subject, pekingUnit, period } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if peking unit not permitted, then throw error
    if (
      pekingUnit &&
      _.find(pekingUnit, function (o) {
        return (
          o !== Peking_Unit_Enum.JOURNALS_001 &&
          o !== Peking_Unit_Enum.JOURNALS_002 &&
          o !== Peking_Unit_Enum.JOURNALS_003
        );
      })
    ) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.PEKING_UNIT_NOT_FOUND_ERROR });
    }
    // if type not found, then throw error
    if (type && type !== Content_Types_Enum.PERIODICAL) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TYPE_NOT_FOUND_ERROR });
    }
    // if subject not found in database, then throw error
    if (subject) {
      const subjectInfo = await subjectsRepository.findBy({
        id: In(subject),
        type: Content_Types_Enum.PERIODICAL,
      });
      if (!subjectInfo || (subjectInfo && subjectInfo.length !== subject.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.SUBJECT_NOT_FOUND_ERROR });
      }
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    // if language not found in database, then throw error
    if (language) {
      const languages = await languagesRepository.findBy({
        id: In(language),
        type: Like(`%${Content_Types_Enum.PERIODICAL}%`),
      });
      if (!languages || (languages && languages.length !== language.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.LANGUAGE_NOT_FOUND_ERROR });
      }
    }
    // if period not found in database, then throw error
    if (period) {
      const periodInfo = await periodicalPeriodsRepository.findOneBy({
        id: period,
      });
      if (!periodInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.PERIOD_NOT_FOUND_ERROR });
      }
    }

    if (id) {
      // if id exist get periodicalInfo
      const periodicalInfo = await periodicalsRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!periodicalInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await periodicalsRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    console.log(result);
    return ResultData.ok({ data: result });
  }
  /**
   * @description 期刊列表
   * @param {ListPeriodicalDto} params
   * @returns {ResultData} 返回listPeriodical信息
   */
  async listPeriodical(params: ListPeriodicalDto, user: SignInResInfo): Promise<ResultData> {
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
    // get periodicals
    const [periodicals, count] = await periodicalsRepository.findAndCount({
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
      return ResultData.ok({ data: { periodicals: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          periodicals.map((periodical) => {
            return periodical.columnId;
          })
        ),
      },
    });
    const result = periodicals.map((periodical) => {
      return {
        id: periodical.id,
        name: periodical.name,
        clicks: periodical.clicks,
        status: periodical.status,
        updatedAt: periodical.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === periodical.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { periodicals: result, count: count } });
  }
  /**
   * @description 操作期刊
   * @param {OperatePeriodicalsDto} params 操作期刊的相关参数
   * @returns {ResultData} 返回operatePeriodicals信息
   */
  async operatePeriodicals(
    params: OperatePeriodicalsDto,
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
    const success = await periodicalsRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await periodicalsRepository.update(
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
   * @description 删除期刊
   * @param {RemovePeriodicalsDto} params 删除期刊的相关参数
   * @returns {ResultData} 返回removePeriodicals信息
   */
  async removePeriodicals(params: RemovePeriodicalsDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await periodicalsRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await periodicalsRepository.update(
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
