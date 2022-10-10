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
  GetTermCountByUnitDto,
  GetTermDetailDto,
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

export class TermsService {
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
    //get columns
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
          units: unitCount ? unitCount : [],
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
}
