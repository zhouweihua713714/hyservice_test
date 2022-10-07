import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  columnsRepository,
  patentsRepository,
  patentTypesRepository,
  patentValidTypesRepository,
  userHistoryRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetPatentChartsDto,
  GetPatentDetailDto,
  ListComplexPatentDto,
  ListPatentDto,
  OperatePatentsDto,
  RemovePatentsDto,
  SavePatentDto,
} from './patents.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like } from 'typeorm';

export class PatentsService {
  /**
   * @description 获取专利详情
   * @param {GetPatentDetailDto} params
   * @returns {ResultData} 返回getPatentDetail信息
   */
  async getPatentDetail(params: GetPatentDetailDto, user: SignInResInfo): Promise<ResultData> {
    const patentInfo = await patentsRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!patentInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: patentInfo.columnId });
    // get necessary data
    let userInfo;
    let typeInfo;
    let validTypeInfo;
    // if type not found in database, then throw error
    if (patentInfo.type) {
      typeInfo = await patentTypesRepository.findOneBy({
        id: patentInfo.type,
      });
    }
    // if validStatus not found in database, then throw error
    if (patentInfo.validStatus) {
      validTypeInfo = await patentValidTypesRepository.findOneBy({
        id: patentInfo.validStatus,
      });
    }
    if (patentInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: patentInfo.ownerId });
    }
    const result = {
      typeName: typeInfo ? typeInfo.name : null,
      columnName: columnInfo ? columnInfo.name : null,
      validStatusName: validTypeInfo ? validTypeInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...patentInfo,
    };
    // update clicks
    if (params.flag) {
      await patentsRepository.update(params.id, { clicks: patentInfo.clicks + 1 });
    }
    // if user login then record history
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.PATENT,
      });
    }
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存专利
   * @param {SavePatentDto} params 保存专利的相关参数
   * @returns {ResultData} 返回savePatent信息
   */
  async savePatent(params: SavePatentDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, columnId, type, validStatus } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    // if type not found in database, then throw error
    if (type) {
      const typeInfo = await patentTypesRepository.findOneBy({
        id: type,
      });
      if (!typeInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.TYPE_NOT_FOUND_ERROR });
      }
    }
    // if validStatus not found in database, then throw error
    if (validStatus) {
      const validTypeInfo = await patentValidTypesRepository.findOneBy({
        id: validStatus,
      });
      if (!validTypeInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.VALID_TYPE_NOT_FOUND_ERROR });
      }
    }
    if (id) {
      // if id exist get patentInfo
      const patentInfo = await patentsRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!patentInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await patentsRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 专利列表
   * @param {ListPatentDto} params
   * @returns {ResultData} 返回listPatent信息
   */
  async listPatent(params: ListPatentDto, user: SignInResInfo): Promise<ResultData> {
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
    // get patents
    const [patents, count] = await patentsRepository.findAndCount({
      where: {
        ...statusCondition,
        ...columnCondition,
        ...titleCondition,
        enabled: true,
        deletedAt: IsNull(),
      },
      select: ['id', 'columnId', 'title', 'clicks', 'status', 'updatedAt'],
      skip: (page - 1) * size,
      take: size,
      order: {
        status: 'DESC',
        updatedAt: 'DESC',
      },
    });
    if (count === 0) {
      return ResultData.ok({ data: { patents: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          patents.map((patent) => {
            return patent.columnId;
          })
        ),
      },
    });
    const result = patents.map((patent) => {
      return {
        id: patent.id,
        title: patent.title,
        clicks: patent.clicks,
        status: patent.status,
        updatedAt: patent.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === patent.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { patents: result, count: count } });
  }
  /**
   * @description 操作专利
   * @param {OperatePatentsDto} params 操作专利的相关参数
   * @returns {ResultData} 返回operatePatents信息
   */
  async operatePatents(params: OperatePatentsDto, user: SignInResInfo): Promise<ResultData> {
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
    const success = await patentsRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await patentsRepository.update(
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
   * @description 删除专利
   * @param {RemovePatentsDto} params 删除专利的相关参数
   * @returns {ResultData} 返回removePatents信息
   */
  async removePatents(params: RemovePatentsDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await patentsRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await patentsRepository.update(
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
   * @description 专利列表(c端)
   * @param {ListComplexPatentDto} params专利列表参数
   * @returns {ResultData} 返回listComplexPatent信息
   */
  async listComplexPatent(params: ListComplexPatentDto, user: SignInResInfo): Promise<ResultData> {
    const { keyword, type, page, size } = params;
    // get basic condition
    let patents, count, keywords;
    let basicCondition =
      'patents.enabled = true and patents.deletedAt is null and patents.status =:status';
    if (type) {
      basicCondition += ' and patents.type =:type';
    }
    if (keyword) {
      // get keywords
      keywords = `%${keyword.replace(';', '%;%')}%`.split(';');
      [patents, count] = await patentsRepository
        .createQueryBuilder('patents')
        .select([
          'patents.id',
          'patents.title',
          'patents.announcedAt',
          'patents.applicant',
          'patents.abstract',
          'patents.type',
          'patents.keyword',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          type: type,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('patents.title like any (ARRAY[:...keyword])', { keyword: keywords })
              .orWhere('patents.keyword like any (ARRAY[:...keyword])', { keyword: keywords })
              .orWhere('patents.abstract like any (ARRAY[:...keyword])', { keyword: keywords });
          })
        )
        .orderBy('patents.announcedAt', 'DESC')
        .orderBy('patents.publishedAt', 'DESC')
        .skip((page - 1)*size)
        .take(size)
        .getManyAndCount();
    } else {
      // get patents and count
      [patents, count] = await patentsRepository
        .createQueryBuilder('patents')
        .select([
          'patents.id',
          'patents.title',
          'patents.announcedAt',
          'patents.applicant',
          'patents.abstract',
          'patents.type',
          'patents.keyword',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          type: type,
        })
        .orderBy('patents.announcedAt', 'DESC')
        .orderBy('patents.publishedAt', 'DESC')
        .skip((page - 1)*size)
        .take(size)
        .getManyAndCount();
    }
    if (count === 0) {
      return ResultData.ok({ data: { patents: [], count: count } });
    }
    const types = await patentTypesRepository.findBy({
      id: In(
        patents.map((data) => {
          return data.type;
        })
      ),
    });
    const result = patents.map((data) => {
      return {
        ...data,
        typeName: _.find(types, function (o) {
          return o.id === data.type;
        })
          ? _.find(types, function (o) {
              return o.id === data.type;
            })?.name
          : null,
      };
    });
    return ResultData.ok({ data: { patents: result, count: count } });
  }
  /**
   * @description 高频发明人TOP10
   * @param {} params 高频发明人TOP10的相关参数
   * @returns {ResultData} 返回getPatentCountByAgent信息
   */
  async getPatentCountByAgent(params: any, user: SignInResInfo): Promise<ResultData> {
    // get patent count by agent
    const patents = await patentsRepository
      .createQueryBuilder('patents')
      .select('COUNT(patents.id)', 'count')
      .addSelect('patents.agent', 'agent')
      .where('patents.enabled = true and patents.deletedAt is null and patents.status =:status', {
        status: Content_Status_Enum.ACTIVE,
      })
      .groupBy('patents.agent')
      .getRawMany();
    // get necessary
    let agents = _.uniqBy(
      patents.map((data) => {
        return { count: data.count };
      }),
      'count'
    );
    if (patents.length === 0) {
      return ResultData.ok({
        data: { agents: [] },
      });
    }
    // get agent and order
    agents = _.orderBy(
      agents.map((data) => {
        return {
          count: data.count,
          agent: _.groupBy(patents, 'count')[data.count]
            ? _.join(
                _.groupBy(patents, 'count')[data.count].map((data) => {
                  return data.agent;
                }),
                ';'
              )
            : null,
        };
      }),
      'count',
      'desc'
    );
    // get top 10  it's up to PM
    agents = agents.slice(0, 10);
    return ResultData.ok({
      data: { agents: agents },
    });
  }
  /**
   * @description 专利图表(学校分布统计、年份分布统计、类型分布统计)
   * @param {GetPatentChartsDto} params 专利图表的相关参数
   * @returns {ResultData} 返回getPatentCharts信息
   */
  async getPatentCharts(params: GetPatentChartsDto, user: SignInResInfo): Promise<ResultData> {
    const { type } = params;
    let patents, groupByCondition;
    if (type === 'applicant') {
      groupByCondition = 'patents.applicant';
    }
    if (type === 'year') {
      groupByCondition = 'extract(year from patents.announcedAt) ';
    }
    if (type === 'type') {
      groupByCondition = 'patents.type';
    }
    // get patent count by applicant
    patents = await patentsRepository
      .createQueryBuilder('patents')
      .select('COUNT(patents.id)', 'count')
      .addSelect(`${groupByCondition}`, 'name')
      .where('patents.enabled = true and patents.deletedAt is null and patents.status =:status', {
        status: Content_Status_Enum.ACTIVE,
      })
      .groupBy(`${groupByCondition}`)
      .getRawMany();
    patents = patents.map((data) => {
      return {
        name: data.name,
        count: Number(data.count),
      };
    });
    if (type === 'applicant') {
      // get applicant and order
      patents = _.orderBy(patents, 'count', 'desc');
      // get top 10  it's up to PM
      patents = patents.slice(0, 10);
    }
    if (type === 'year') {
      patents = _.orderBy(patents, 'name', 'asc');
    }
    if (type === 'type') {
      const types = await patentTypesRepository.find({});
      patents = patents.map((data) => {
        return {
          name: _.find(types, function (o) {
            return o.id === data.name;
          })
            ? _.find(types, function (o) {
                return o.id === data.name;
              })?.name
            : data.type,
          count: data.count,
          percent: Number(((data.count / _.sumBy(patents, 'count')) * 100).toFixed(1)),
        };
      });
    }
    return ResultData.ok({
      data: { patents: patents ? patents : [] },
    });
  }
}
