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
  userHistoryRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetPeriodicalDetailDto,
  ListComplexPeriodicalDto,
  ListPeriodicalDto,
  OperatePeriodicalsDto,
  RecommendPeriodicalsByIdDto,
  RecommendPeriodicalsDto,
  RemovePeriodicalsDto,
  SavePeriodicalDto,
} from './periodicals.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  Peking_Unit_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class PeriodicalsService {
  constructor( private readonly usersService: UsersService) {}

  /**
   * @description 获取期刊详情
   * @param {GetPeriodicalDetailDto} params
   * @returns {ResultData} 返回getPeriodicalDetail信息
   */
  async getPeriodicalDetail(
    params: GetPeriodicalDetailDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const periodicalInfo = await periodicalsRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!periodicalInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: periodicalInfo.columnId });
    // get necessary data
    let userInfo;
    let subjectInfo;
    let languageInfo;
    let periodInfo;
    if (periodicalInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: periodicalInfo.ownerId });
    }
    if (periodicalInfo.subject) {
      subjectInfo = await subjectsRepository.findBy({
        id: In(periodicalInfo.subject as string[]),
        type: Content_Types_Enum.PERIODICAL,
      });
    }
    if (periodicalInfo.language) {
      languageInfo = await languagesRepository.findBy({
        id: In(periodicalInfo.language as string[]),
        type: Like(`%${Content_Types_Enum.PERIODICAL}%`),
      });
    }
    if (periodicalInfo.period) {
      periodInfo = await periodicalPeriodsRepository.findOneBy({
        id: periodicalInfo.period,
      });
    }
    const result = {
      subjectName: subjectInfo
        ? _.join(
            subjectInfo.map((subject) => {
              return subject.name;
            }),
            ';'
          )
        : null,
      languageName: languageInfo
        ? _.join(
            languageInfo.map((language) => {
              return language.name;
            }),
            ';'
          )
        : null,
      periodName: periodInfo ? periodInfo.name : null,
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...periodicalInfo,
    };
    // update clicks
    if (params.flag) {
      await periodicalsRepository.update(params.id, { clicks: periodicalInfo.clicks + 1 });
    }
    // if user login then record history
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.PERIODICAL,
      });
    }
    return ResultData.ok({ data: result });
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
  /**
   * @description 期刊列表(c端)
   * @param {ListComplexPeriodicalDto} params
   * @returns {ResultData} 返回listComplexPeriodical信息
   */
  async listComplexPeriodical(
    params: ListComplexPeriodicalDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId, keyword, page, size } = params;
    // get basic condition
    let basicCondition =
      'periodicals.enabled = true and periodicals.deletedAt is null and periodicals.status =:status';
    if (columnId) {
      basicCondition += ' and periodicals.columnId = :columnId';
    }
    // get periodicals and count
    let periodicals;
    let count;
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.replace(/;/g, '%;%')}%`.split(';');
      [periodicals, count] = await periodicalsRepository
        .createQueryBuilder('periodicals')
        .select([
          'periodicals.id',
          'periodicals.name',
          'periodicals.subject',
          'periodicals.field',
          'periodicals.minorField',
          'periodicals.type',
          'periodicals.period',
          'periodicals.articleNumber',
          'periodicals.compositeImpactFactor',
          'periodicals.ISSN',
          'periodicals.citeScore',
          'periodicals.citeRate',
          'periodicals.quote',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('periodicals.name like any (ARRAY[:...keyword])', { keyword: keywords });
          })
        )
        .orderBy('periodicals.articleNumber', 'DESC','NULLS LAST')
        .addOrderBy('periodicals.establishedAt', 'DESC','NULLS LAST')
        .addOrderBy('periodicals.publishedAt', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    } else {
      [periodicals, count] = await periodicalsRepository
        .createQueryBuilder('periodicals')
        .select([
          'periodicals.id',
          'periodicals.name',
          'periodicals.subject',
          'periodicals.field',
          'periodicals.minorField',
          'periodicals.type',
          'periodicals.period',
          'periodicals.articleNumber',
          'periodicals.compositeImpactFactor',
          'periodicals.ISSN',
          'periodicals.citeScore',
          'periodicals.citeRate',
          'periodicals.quote',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
        })
        .orderBy('periodicals.articleNumber', 'DESC','NULLS LAST')
        .addOrderBy('periodicals.establishedAt', 'DESC','NULLS LAST')
        .addOrderBy('periodicals.publishedAt', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    }
    if (count === 0) {
      return ResultData.ok({ data: { periodicals: [], count: count } });
    }
    // get subject 、period
    let subjectIds;
    let subjects;
    // let periodIds;
    let periods;
    const periodIds = periodicals.map((data) => {
      subjectIds = _.union(data.subject, subjectIds);
      return data.period;
    });
    if (subjectIds.length > 0) {
      subjects = await subjectsRepository.find({
        where: {
          id: In(subjectIds),
        },
      });
    }
    if (periodIds.length > 0) {
      periods = await periodicalPeriodsRepository.find({
        where: {
          id: In(periodIds),
        },
      });
    }
    const result = periodicals.map((data) => {
      let subjectInfo;
      if (data.subject) {
        subjectInfo = data.subject.map((data) => {
          return {
            name: _.find(subjects, function (o) {
              return o.id === data;
            })
              ? _.find(subjects, function (o) {
                  return o.id === data;
                }).name
              : null,
          };
        });
      }
      return {
        ...data,
        periodName: _.find(periods, function (o) {
          return o.id === data.period;
        })
          ? _.find(periods, function (o) {
              return o.id === data.period;
            }).name
          : null,
        subjectName: subjectInfo
          ? _.join(
              subjectInfo.map((subject) => {
                return subject.name;
              }),
              ';'
            )
          : null,
      };
    });
    // 搜索埋点
    await this.usersService.recordUserSearchTimes({
      keywords: keyword?.split(';') || [],
      type: Content_Types_Enum.PERIODICAL,
      userId: user?.id,
      columnId: columnId || '0',
    });
    return ResultData.ok({ data: { periodicals: result, count: count } });
  }
  /**
   * @description 推荐期刊(相关推荐)
   * @param {RecommendPeriodicalsDto} params 推荐期刊的相关参数
   * @returns {ResultData} 返回recommendPeriodicals信息
   */
  async recommendPeriodicals(
    params: RecommendPeriodicalsDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId } = params;
    let columnCondition;
    if (columnId) {
      columnCondition = {
        columnId: columnId,
      };
    }
    // get periodicals
    const periodicals = await periodicalsRepository.find({
      where: {
        ...columnCondition,
        status: Content_Status_Enum.ACTIVE,
        enabled: true,
        deletedAt: IsNull(),
      },
      select: ['id', 'name', 'ISSN', 'type', 'minorField', 'field', 'coverUrl'],
      take: 5, // it's up to PM
      order: {
        clicks: 'DESC',
        publishedAt: 'DESC',
      },
    });
    return ResultData.ok({
      data: { periodicals: periodicals },
    });
  }
  /**
   * @description 推荐期刊(为您推荐)
   * @param {RecommendPeriodicalsByIdDto} params 推荐期刊的相关参数
   * @returns {ResultData} 返回recommendPeriodicalsById信息
   */
  async recommendPeriodicalsById(
    params: RecommendPeriodicalsByIdDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    const periodicalInfo = await periodicalsRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    const field = periodicalInfo?.field;
    const minorField = periodicalInfo?.minorField;
    let periodicals;
    let basicCondition =
      'periodicals.enabled = true and periodicals.deletedAt is null and periodicals.status =:status';
    if (periodicalInfo) {
      basicCondition += ' and periodicals.id !=:id';
    }
    if (field) {
      const fields = `%${field.replace(/;/g, '%;%')}%`.split(';');
      periodicals = await periodicalsRepository
        .createQueryBuilder('periodicals')
        .select(['periodicals.id', 'periodicals.name', 'periodicals.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: periodicalInfo?.id,
        })
        .andWhere('periodicals.field like any (ARRAY[:...field])', {
          field: fields,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(8)
        .getMany();
    }
    let idsCondition = '';

    // if periodicals count < 8 then minorField recommend
    if (periodicals && periodicals.length < 8) {
      if (periodicals.length > 0) {
        idsCondition = ' and id not in (:...ids)';
      }
      if (minorField) {
        const minorFields = `%${minorField.replace(/;/g, '%;%')}%`.split(';');
        const newPeriodicals = await periodicalsRepository
          .createQueryBuilder('periodicals')
          .select(['periodicals.id', 'periodicals.name', 'periodicals.columnId'])
          .where(`${basicCondition}${idsCondition}`, {
            status: Content_Status_Enum.ACTIVE,
            id: periodicalInfo?.id,
            ids: periodicals.map((data) => {
              return data.id;
            }),
          })
          .andWhere('periodicals.minor_field like any (ARRAY[:...minorField])', {
            minorField: minorFields,
          })
          .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
          .take(8 - periodicals.length)
          .getMany();
        periodicals = _.unionBy(periodicals, newPeriodicals, 'id');
      }
    }
    // if periodicals count < 8 then all periodical recommend
    if (!periodicalInfo || !periodicals || (periodicals && periodicals.length < 8)) {
      let size = 8;
      if (periodicals) {
        size = size - periodicals.length;
      }
      const newPeriodicals = await periodicalsRepository
        .createQueryBuilder('periodicals')
        .select(['periodicals.id', 'periodicals.name', 'periodicals.columnId'])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: periodicalInfo?.id,
          ids: periodicals
            ? periodicals.map((data) => {
                return data.id;
              })
            : undefined,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      periodicals = _.unionBy(periodicals, newPeriodicals, 'id');
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
        ...periodical,
        columnName: _.find(columns, function (o) {
          return o.id === periodical.columnId;
        })?.name,
      };
    });
    return ResultData.ok({
      data: { periodicals: result ? result : [] },
    });
  }
}
