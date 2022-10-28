import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  subjectsRepository,
  termsRepository,
  termTypesRepository,
  userHistoryRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetMoneyByYearDto,
  GetTermCountByProvinceDto,
  GetTermCountByTypeDto,
  GetTermCountByUnitDto,
  GetTermCountByYearDto,
  GetTermDetailDto,
  GetTermPercentBySubjectDto,
  ListComplexTermDto,
  ListTermDto,
  OperateTermsDto,
  RemoveTermsDto,
  SaveTermDto,
} from './terms.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like } from 'typeorm';
import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class TermsService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description 获取项目详情
   * @param {GetTermDetailDto} params
   * @returns {ResultData} 返回getTermDetail信息
   */
  async getTermDetail(params: GetTermDetailDto, user: SignInResInfo): Promise<ResultData> {
    const termInfo = await termsRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!termInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const type = termInfo.type ? termInfo.type : '-1';
    const subject = termInfo.subject ? termInfo.subject : '-1';

    const [columnInfo, typeInfo, subjectInfo] = await Promise.all([
      columnsRepository.findOneBy({ id: termInfo.columnId }),
      termTypesRepository.findOneBy({ id: type }),
      subjectsRepository.findOneBy({ id: subject }),
    ]);
    let userInfo;
    if (termInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: termInfo.ownerId });
    }
    const result = {
      typeName: typeInfo ? typeInfo.name : null,
      subjectName: subjectInfo ? subjectInfo.name : null,
      columnName: columnInfo ? columnInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...termInfo,
    };
    // update clicks
    if (params.flag) {
      await termsRepository.update(params.id, { clicks: termInfo.clicks + 1 });
    }
    // if user login then record history
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.TERM,
      });
    }
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存项目
   * @param {SaveTermDto} params 保存项目的相关参数
   * @returns {ResultData} 返回saveTerm信息
   */
  async saveTerm(params: SaveTermDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, termNumber, type, subject, columnId, startedAt, endedAt, authorizedAt } =
      params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if type not found in database, then throw error
    if (type) {
      const typeInfo = await termTypesRepository.findOneBy({ id: type });
      if (!typeInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TYPE_NOT_FOUND_ERROR });
      }
    }
    // if subject not found in database, then throw error
    if (subject) {
      const subjectInfo = await subjectsRepository.findOneBy({ id: subject });
      if (!subjectInfo || (subjectInfo && subjectInfo.type !== Content_Types_Enum.TERM)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.SUBJECT_NOT_FOUND_ERROR });
      }
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    //  startedAt < endedAt
    if (startedAt && endedAt && new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.START_TIME_ERROR });
    }

    if (id) {
      // if id exist get termInfo
      const termInfo = await termsRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!termInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await termsRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      year: authorizedAt ? new Date(authorizedAt).getFullYear() : null,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 项目列表
   * @param {ListTermDto} params
   * @returns {ResultData} 返回listTerm信息
   */
  async listTerm(params: ListTermDto, user: SignInResInfo): Promise<ResultData> {
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
    // get terms
    const [terms, count] = await termsRepository.findAndCount({
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
      return ResultData.ok({ data: { terms: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          terms.map((term) => {
            return term.columnId;
          })
        ),
      },
    });
    const result = terms.map((term) => {
      return {
        id: term.id,
        name: term.name,
        clicks: term.clicks,
        status: term.status,
        updatedAt: term.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === term.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { terms: result, count: count } });
  }
  /**
   * @description 操作项目
   * @param {OperateTermsDto} params 操作项目的相关参数
   * @returns {ResultData} 返回operateTerms信息
   */
  async operateTerms(params: OperateTermsDto, user: SignInResInfo): Promise<ResultData> {
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
    const success = await termsRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await termsRepository.update(
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
   * @description 删除项目
   * @param {RemoveTermsDto} params 删除项目的相关参数
   * @returns {ResultData} 返回removeTerms信息
   */
  async removeTerms(params: RemoveTermsDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await termsRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await termsRepository.update(
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
   * @description 项目列表(c端)
   * @param {ListComplexTermDto} params
   * @returns {ResultData} 返回listComplexTerm信息
   */
  async listComplexTerm(params: ListComplexTermDto, user: SignInResInfo): Promise<ResultData> {
    const { columnId, keyword, unit, type, principal, authorizedAt, page, size } = params;
    //
    if (
      columnId &&
      columnId === 'column_01_03' &&
      !keyword &&
      !unit &&
      !type &&
      !principal &&
      !authorizedAt
    ) {
      return ResultData.ok({ data: { terms: [], count: 0 } });
    }
    // get basic condition
    let basicCondition =
      'terms.enabled = true and terms.deletedAt is null and terms.status =:status';
    if (unit) {
      basicCondition += ' and terms.unit like :unit';
    }
    if (type) {
      basicCondition += ' and terms.type = :type';
    }
    if (authorizedAt) {
      basicCondition += ' and terms.year = :year';
    }
    if (principal) {
      basicCondition += ' and terms.principal like :principal';
    }
    if (columnId) {
      basicCondition += ' and terms.columnId = :columnId';
    }
    // get terms and count
    let terms;
    let count;
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.replace(';', '%;%')}%`.split(';');
      [terms, count] = await termsRepository
        .createQueryBuilder('terms')
        .select([
          'terms.id',
          'terms.name',
          'terms.termNumber',
          'terms.unit',
          'terms.type',
          'terms.authorizedAt',
          'terms.unit',
          'terms.principal',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          unit: `%${unit}%`,
          type: type,
          principal: `%${principal}%`,
          year: new Date(authorizedAt).getFullYear(),
          columnId: columnId,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('terms.name like any (ARRAY[:...keyword])', { keyword: keywords }).orWhere(
              'terms.keyword like any (ARRAY[:...keyword])',
              { keyword: keywords }
            );
          })
        )
        .orderBy('terms.year', 'DESC')
        .addOrderBy('terms.publishedAt', 'DESC')
        .addOrderBy('terms.name', 'ASC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    } else {
      [terms, count] = await termsRepository
        .createQueryBuilder('terms')
        .select([
          'terms.id',
          'terms.name',
          'terms.termNumber',
          'terms.unit',
          'terms.type',
          'terms.authorizedAt',
          'terms.unit',
          'terms.principal',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          unit: `%${unit}%`,
          type: type,
          principal: `%${principal}%`,
          year: new Date(authorizedAt).getFullYear(),
          columnId: columnId,
        })
        .orderBy('terms.year', 'DESC')
        .addOrderBy('terms.publishedAt', 'DESC')
        .addOrderBy('terms.name', 'ASC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    }
    // get termTypes
    const termTypes = await termTypesRepository.find({
      where: {
        id: In(
          terms.map((term) => {
            return term.type;
          })
        ),
      },
    });
    const result = terms.map((term) => {
      return {
        ...term,
        typeName: _.find(termTypes, function (o) {
          return o.id === term.type;
        })?.name,
      };
    });
    // 搜索埋点
    await this.usersService.recordUserSearchTimes({
      keywords: keyword?.split(';') || [],
      type: Content_Types_Enum.TERM,
      userId: user.id,
      columnId: columnId || '0',
    });
    return ResultData.ok({ data: { terms: result, count: count } });
  }
  /**
   * @description 依托单位分布
   * @param {GetTermCountByUnitDto} params 依托单位分布的相关参数
   * @returns {ResultData} 返回getTermCountByUnit信息
   */
  async getTermCountByUnit(
    params: GetTermCountByUnitDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId } = params;
    // ( 'column_01_01', '国家社会科学基金项目', 'column_01', '1', '0' ),
    // ( 'column_01_02', '教育部人文社科项目', 'column_01', '2', '0' ),
    // ( 'column_01_03', '国家自然科学基金项目(F0701)', 'column_01', '3', '0' ),
    let yearCount, unitTop10, terms;
    [yearCount, unitTop10, terms] = await Promise.all([
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .getRawMany(),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.unit', 'unit')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.unit')
        .getRawMany(),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .addSelect('terms.unit', 'unit')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .addGroupBy('terms.unit')
        .getRawMany(),
    ]);
    // get Number count
    terms = terms.map((data) => {
      return { unit: data.unit, count: Number(data.count), year: data.year };
    });
    unitTop10 = _.orderBy(
      unitTop10.map((data) => {
        return {
          count: Number(data.count),
          unit: data.unit,
          yearCount: _.filter(terms, function (o) {
            return o.unit === data.unit;
          }),
        };
      }),
      'count',
      'desc'
    );
    // get top 10 unit
    unitTop10 = unitTop10.slice(0, 10);
    // get year count and unit details
    yearCount = _.orderBy(
      yearCount.map((data) => {
        let unitCount;
        if (_.groupBy(terms, 'year')[data.year]) {
          unitCount = _.intersectionBy(_.groupBy(terms, 'year')[data.year], unitTop10, 'unit');
        }
        return {
          count: Number(data.count),
          year: data.year,
          units: unitCount
            ? _.orderBy(
                unitCount.map((data) => {
                  return {
                    unit: data.unit,
                    count: Number(data.count),
                    year: data.year,
                    order: _.find(unitTop10, function (o) {
                      return o.unit === data.unit;
                    })
                      ? _.find(unitTop10, function (o) {
                          return o.unit === data.unit;
                        }).count
                      : 0,
                  };
                }),
                'order',
                'desc'
              )
            : [],
          topCount: _.sumBy(unitCount, 'count'),
        };
      }),
      'year',
      'asc'
    );
    return ResultData.ok({
      data: { yearCounts: yearCount, unitTop10: unitTop10 },
    });
  }
  /**
   * @description 类型分布占比
   * @param {GetTermCountByTypeDto} params 类型分布占比的相关参数
   * @returns {ResultData} 返回getTermCountByType信息
   */
  async getTermCountByType(
    params: GetTermCountByTypeDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId } = params;
    let typeCount, yearCount, terms, types;
    [typeCount, yearCount, terms, types] = await Promise.all([
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.type', 'type')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.type')
        .getRawMany(),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .getRawMany(),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .addSelect('terms.type', 'type')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .addGroupBy('terms.type')
        .getRawMany(),
      termTypesRepository.find(),
    ]);
    types = types.map((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    });
    yearCount = yearCount.map((data) => {
      return { year: data.year, count: Number(data.count) };
    });
    terms = terms.map((data) => {
      return { year: data.year, count: Number(data.count), type: data.type };
    });
    // get type name
    typeCount = _.orderBy(
      typeCount.map((data) => {
        return {
          id: data.type,
          name: _.find(types, function (o) {
            return o.id === data.type;
          })
            ? _.find(types, function (o) {
                return o.id === data.type;
              }).name
            : null,
          count: Number(data.count),
          percent: Number(
            (
              (Number(data.count) /
                _.sumBy(
                  typeCount.map((data) => {
                    return { count: Number(data.count) };
                  }),
                  'count'
                )) *
              100
            ).toFixed(1)
          ),
        };
      }),
      'count',
      'desc'
    );
    yearCount = _.orderBy(
      yearCount.map((data) => {
        // const percent = Number(((data.count / _.sumBy(yearCount, 'count')) * 100).toFixed(1));
        return {
          year: data.year,
          count: data.count,
          // percent: percent,
          types: _.groupBy(terms, 'year')[data.year]
            ? _.orderBy(
                _.filter(
                  _.groupBy(terms, 'year')[data.year].map((miniData) => {
                    const yearCount = _.sumBy(
                      _.filter(terms, function (o) {
                        return o.year === miniData.year;
                      }),
                      'count'
                    );
                    return {
                      id: miniData.type,
                      name: _.find(types, function (o) {
                        return o.id === miniData.type;
                      })
                        ? _.find(types, function (o) {
                            return o.id === miniData.type;
                          }).name
                        : null,
                      count: miniData.count,
                      percent: Number(((miniData.count / yearCount) * 100).toFixed(1)),
                    };
                  }),
                  function (o) {
                    return o.id;
                  }
                ),
                'id',
                'asc'
              )
            : [],
        };
      }),
      'year',
      'asc'
    );
    // filter !type
    typeCount = _.filter(typeCount, function (o) {
      return o.id;
    });
    return ResultData.ok({
      data: { typeCounts: typeCount, yearCounts: yearCount },
    });
  }
  /**
   * @description 项目类别时间分析(目前只有教育部人文社科项目有)
   * @param {GetTermCountByYearDto} params 项目类别时间分析(目前只有教育部人文社科项目有)的相关参数
   * @returns {ResultData} 返回getTermCountByYear信息
   */
  async getTermCountByYear(
    params: GetTermCountByYearDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId } = params;
    let yearCount, types, terms;
    [yearCount, types, terms] = await Promise.all([
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .getRawMany(),
      termTypesRepository.find(),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.type', 'type')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .addGroupBy('terms.type')
        .getRawMany(),
    ]);
    types = types.map((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    });
    // get Number count
    terms = terms.map((data) => {
      return { type: data.type, count: Number(data.count), year: data.year };
    });
    // get type name
    yearCount = _.orderBy(
      yearCount.map((data) => {
        return {
          year: data.year,
          count: Number(data.count),
          types: _.groupBy(terms, 'year')[data.year]
            ? _.filter(
                _.orderBy(
                  _.groupBy(terms, 'year')[data.year].map((data) => {
                    return {
                      id: data.type,
                      name: _.find(types, function (o) {
                        return o.id === data.type;
                      })
                        ? _.find(types, function (o) {
                            return o.id === data.type;
                          }).name
                        : null,
                      count: data.count,
                    };
                  }),
                  'count',
                  'desc'
                ),
                function (o) {
                  return o.id; // filter !type
                }
              )
            : [],
        };
      }),
      'year',
      'asc'
    );

    return ResultData.ok({
      data: { yearCounts: yearCount },
    });
  }
  /**
   * @description 不同研究方向资助率(国家自然科学基金有)
   * @param {GetTermPercentBySubjectDto} params 不同研究方向资助率(国家自然科学基金有)的相关参数
   * @returns {ResultData} 返回getTermPercentBySubject信息
   */
  async getTermPercentBySubject(
    params: GetTermPercentBySubjectDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId } = params;
    let subjectCount, subjects, terms;
    [subjectCount, subjects, terms] = await Promise.all([
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.subject', 'subject')
        .addSelect('terms.subjectNo', 'subjectNo')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.subject')
        .addGroupBy('terms.subjectNo')
        .getRawMany(),
      subjectsRepository.find({ where: { type: Content_Types_Enum.TERM } }),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.subject', 'subject')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .addGroupBy('terms.subject')
        .getRawMany(),
    ]);
    subjects = subjects.map((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    });
    // get Number count
    terms = terms.map((data) => {
      return { subject: data.subject, count: Number(data.count), year: data.year };
    });
    subjectCount = subjectCount.map((data) => {
      return {
        subject: data.subject,
        subjectNo: data.subjectNo,
        count: Number(data.count),
      };
    });
    // get type name
    subjectCount = _.orderBy(
      subjectCount.map((data) => {
        // const percent = Number(
        //   ((Number(data.count) / _.sumBy(subjectCount, 'count')) * 100).toFixed(1)
        // );
        return {
          subject: data.subject,
          subjectNo: data.subjectNo,
          subjectName: _.find(subjects, function (o) {
            return o.id === data.subject;
          })
            ? _.find(subjects, function (o) {
                return o.id === data.subject;
              }).name
            : null,
          // percent: percent,
          years: _.groupBy(terms, 'subject')[data.subject]
            ? _.groupBy(terms, 'subject')[data.subject].map((miniData) => {
                const yearCount = _.sumBy(
                  _.filter(terms, function (o) {
                    return o.year === miniData.year;
                  }),
                  'count'
                );
                return {
                  year: miniData.year,
                  percent: Number(((miniData.count / yearCount) * 100).toFixed(1)),
                };
              })
            : [],
        };
      }),
      'subjectNo',
      'asc'
    );

    // filter !subject
    subjectCount = _.filter(subjectCount, function (o) {
      return o.subject;
    });
    return ResultData.ok({
      data: { subjectCounts: subjectCount },
    });
  }
  /**
   * @description 资助金额分布(国家自然科学基金有)
   * @param {GetMoneyByYearDto} params 资助金额分布(国家自然科学基金有)的相关参数
   * @returns {ResultData} 返回getMoneyByYear信息
   */
  async getMoneyByYear(params: GetMoneyByYearDto, user: SignInResInfo): Promise<ResultData> {
    const { columnId } = params;
    let moneyCount, types, terms;
    [moneyCount, types, terms] = await Promise.all([
      termsRepository
        .createQueryBuilder('terms')
        .select('SUM(terms.money)', 'count')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .getRawMany(),
      termTypesRepository.find(),
      termsRepository
        .createQueryBuilder('terms')
        .select('SUM(terms.money)', 'count')
        .addSelect('terms.year', 'year')
        .addSelect('terms.type', 'type')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .addGroupBy('terms.type')
        .getRawMany(),
    ]);
    types = types.map((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    });
    // get Number count
    terms = terms.map((data) => {
      return { year: data.year, count: Number(data.count), type: data.type };
    });
    moneyCount = moneyCount.map((data) => {
      return {
        year: data.year,
        count: Number(data.count),
      };
    });
    // get type name
    moneyCount = _.orderBy(
      moneyCount.map((data) => {
        return {
          year: data.year,
          money: data.count,
          types: _.groupBy(terms, 'year')[data.year]
            ? _.filter(
                _.orderBy(
                  _.groupBy(terms, 'year')[data.year].map((data) => {
                    return {
                      id: data.type,
                      name: _.find(types, function (o) {
                        return o.id === data.type;
                      })
                        ? _.find(types, function (o) {
                            return o.id === data.type;
                          }).name
                        : null,
                      money: data.count,
                    };
                  }),
                  'id',
                  'asc'
                ),
                function (o) {
                  return o.id; // filter !type
                }
              )
            : [],
        };
      }),
      'year',
      'asc'
    );
    return ResultData.ok({
      data: { moneyCounts: moneyCount },
    });
  }
  /**
   * @description 资助地区分布(国家自然科学基金有)
   * @param {GetTermCountByProvinceDto} params 资助地区分布(国家自然科学基金有)的相关参数
   * @returns {ResultData} 返回getTermCountByProvince信息
   */
  async getTermCountByProvince(
    params: GetTermCountByProvinceDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { columnId } = params;
    let provinceCount, terms;
    [provinceCount, terms] = await Promise.all([
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .getRawMany(),
      termsRepository
        .createQueryBuilder('terms')
        .select('COUNT(terms.id)', 'count')
        .addSelect('terms.year', 'year')
        .addSelect('terms.province', 'province')
        .where(
          'terms.enabled = true and terms.deletedAt is null and terms.status =:status and terms.columnId =:columnId',
          {
            status: Content_Status_Enum.ACTIVE,
            columnId: columnId,
          }
        )
        .groupBy('terms.year')
        .addGroupBy('terms.province')
        .getRawMany(),
    ]);
    // get Number count
    terms = terms.map((data) => {
      return { year: data.year, count: Number(data.count), province: data.province };
    });
    provinceCount = _.orderBy(
      provinceCount.map((data) => {
        return {
          year: data.year,
          count: Number(data.count),
          provinces: _.groupBy(terms, 'year')[data.year]
            ? _.orderBy(
                _.filter(_.groupBy(terms, 'year')[data.year], function (o) {
                  return o.province;
                }),
                'province',
                'asc'
              )
            : [],
        };
      }),
      'year',
      'asc'
    );
    return ResultData.ok({
      data: { provinceCounts: provinceCount },
    });
  }
  /**
   * @description 申请、资助情况(国家自然科学基金有)
   * @param {} params 资助地区分布(国家自然科学基金有)的相关参数
   * @returns {ResultData} 返回getTermPercentByYear信息
   */
  async getTermPercentByYear(params: any, user: SignInResInfo): Promise<ResultData> {
    const terms = [
      { year: 2018, applicantCount: 737, count: 60, percent: 8.14 },
      { year: 2019, applicantCount: 556, count: 82, percent: 14.75 },
      { year: 2020, applicantCount: 480, count: 85, percent: 17.71 },
      { year: 2021, applicantCount: 487, count: 96, percent: 19.71 },
    ];
    return ResultData.ok({
      data: { yearCounts: terms },
    });
  }
}
