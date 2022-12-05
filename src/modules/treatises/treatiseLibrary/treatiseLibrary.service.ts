import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  treatiseLibraryTypesRepository,
  columnsRepository,
  treatiseLibraryRepository,
  userHistoryRepository,
  usersRepository,
} from '../../repository/repository';
import {
  GetTreatiseLibraryCountBySortAndYearDto,
  GetTreatiseLibraryDetailDto,
  ListComplexTreatiseLibraryDto,
  ListTreatiseLibraryDto,
  OperateTreatiseLibrariesDto,
  RecommendTreatiseLibrariesDto,
  RemoveTreatiseLibrariesDto,
  SaveTreatiseLibraryDto,
} from './treatiseLibrary.dto';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
@Injectable()
export class TreatiseLibraryService {
  constructor(private readonly usersService: UsersService) {}
  /**
   * @description 获取精选文库详情
   * @param {GetTreatiseLibraryDetailDto} params
   * @returns {ResultData} 返回getTreatiseLibraryDetail信息
   */
  async getTreatiseLibraryDetail(
    params: GetTreatiseLibraryDetailDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const treatiseLibraryInfo = await treatiseLibraryRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!treatiseLibraryInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: treatiseLibraryInfo.columnId });
    // get necessary data
    let userInfo, treatiseLibraryTypeInfo;
    if (treatiseLibraryInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: treatiseLibraryInfo.ownerId });
    }
    if (treatiseLibraryInfo.sort) {
      treatiseLibraryTypeInfo = await treatiseLibraryTypesRepository.findBy({
        id: treatiseLibraryInfo.sort,
      });
    }
    // update clicks
    if (params.flag) {
      await treatiseLibraryRepository.update(params.id, { clicks: treatiseLibraryInfo.clicks + 1 });
    }
    // if user login then record history and get user notes by params.id
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.TREATISE_LIBRARY,
      });
    }
    const result = {
      columnName: columnInfo ? columnInfo.name : null,
      sortName: treatiseLibraryTypeInfo ? treatiseLibraryTypeInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...treatiseLibraryInfo,
    };
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存精选文库
   * @param {SaveTreatiseLibraryDto} params 保存精选文库的相关参数
   * @returns {ResultData} 返回saveTreatiseLibrary信息
   */
  async saveTreatiseLibrary(
    params: SaveTreatiseLibraryDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id, status, columnId, sort } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    // if sort not found in database, then throw error
    if (sort) {
      const treatiseLibraryTypeInfo = await treatiseLibraryTypesRepository.findOneBy({
        id: sort,
        columnId: columnId,
      });
      if (!treatiseLibraryTypeInfo) {
        return ResultData.fail({
          ...ErrorCode.CONTENT_MANAGEMENT.TREATISE_LIBRARY_SORT_NOT_FOUND_ERROR,
        });
      }
    }
    if (id) {
      // if id exist get treatiseLibraryInfo
      const treatiseLibraryInfo = await treatiseLibraryRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!treatiseLibraryInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    const result = await treatiseLibraryRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: { ...result } });
  }
  /**
   * @description 精选文库列表
   * @param {ListTreatiseLibraryDto} params
   * @returns {ResultData} 返回listTreatiseLibrary信息
   */
  async listTreatiseLibrary(
    params: ListTreatiseLibraryDto,
    user: SignInResInfo
  ): Promise<ResultData> {
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
    // get treatiseLibrary
    const [treatiseLibrary, count] = await treatiseLibraryRepository.findAndCount({
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
      return ResultData.ok({ data: { treatiseLibrary: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          treatiseLibrary.map((treatise) => {
            return treatise.columnId;
          })
        ),
      },
    });
    const result = treatiseLibrary.map((treatise) => {
      return {
        id: treatise.id,
        title: treatise.title,
        clicks: treatise.clicks,
        status: treatise.status,
        updatedAt: treatise.updatedAt,
        columnId: treatise.columnId,
        columnName: _.find(columns, function (o) {
          return o.id === treatise.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { treatiseLibrary: result, count: count } });
  }
  /**
   * @description 操作精选文库
   * @param {OperateTreatiseLibrariesDto} params 操作精选文库的相关参数
   * @returns {ResultData} 返回operateTreatiseLibraries信息
   */
  async operateTreatiseLibraries(
    params: OperateTreatiseLibrariesDto,
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
    const success = await treatiseLibraryRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await treatiseLibraryRepository.update(
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
   * @description 删除精选文库
   * @param {RemoveTreatiseLibrariesDto} params 删除精选文库的相关参数
   * @returns {ResultData} 返回removeTreatiseLibraries信息
   */
  async removeTreatiseLibraries(
    params: RemoveTreatiseLibrariesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await treatiseLibraryRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await treatiseLibraryRepository.update(
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
   * @description 精选文库列表(c端)
   * @param {} params 精选文库列表(c端)的相关参数
   * @returns {ResultData} 返回listComplexTreatiseLibrary信息
   */
  async listComplexTreatiseLibrary(
    params: ListComplexTreatiseLibraryDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { keyword, sort, columnId, page, size } = params;
    // get basic condition
    let basicCondition =
      'treatiseLibrary.enabled = true and treatiseLibrary.deletedAt is null and treatiseLibrary.status =:status';
    if (columnId) {
      basicCondition += ' and treatiseLibrary.columnId = :columnId';
    }
    if (sort) {
      basicCondition += ' and treatiseLibrary.sort = :sort';
    }
    // get treatiseLibraries and count
    let treatiseLibraries;
    let count;
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.toLowerCase().replace(/;/g, '%;%')}%`.split(';');
      [treatiseLibraries, count] = await treatiseLibraryRepository
        .createQueryBuilder('treatiseLibrary')
        .select([
          'treatiseLibrary.id',
          'treatiseLibrary.title',
          'treatiseLibrary.deliveryAt',
          'treatiseLibrary.author',
          'treatiseLibrary.authorUnit',
          'treatiseLibrary.name',
          'treatiseLibrary.abstract',
          'treatiseLibrary.keyword',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
          sort: sort,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(treatiseLibrary.title) like any (ARRAY[:...keyword])', {
              keyword: keywords,
            })
              .orWhere('LOWER(treatiseLibrary.keyword) like any (ARRAY[:...keyword])', {
                keyword: keywords,
              })
              .orWhere('(treatiseLibrary.abstract) like any (ARRAY[:...keyword])', {
                keyword: keywords,
              });
          })
        )
        .orderBy('treatiseLibrary.deliveryAt', 'DESC', 'NULLS LAST')
        .addOrderBy('treatiseLibrary.publishedAt', 'DESC')
        .addOrderBy('treatiseLibrary.id', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    } else {
      [treatiseLibraries, count] = await treatiseLibraryRepository
        .createQueryBuilder('treatiseLibrary')
        .select([
          'treatiseLibrary.id',
          'treatiseLibrary.title',
          'treatiseLibrary.deliveryAt',
          'treatiseLibrary.author',
          'treatiseLibrary.authorUnit',
          'treatiseLibrary.name',
          'treatiseLibrary.abstract',
          'treatiseLibrary.keyword',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
          sort: sort,
        })
        .orderBy('treatiseLibrary.deliveryAt', 'DESC', 'NULLS LAST')
        .addOrderBy('treatiseLibrary.publishedAt', 'DESC')
        .addOrderBy('treatiseLibrary.id', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    }
    if (count === 0) {
      return ResultData.ok({
        data: { treatiseLibraries: [], count: 0 },
      });
    }
    const result = treatiseLibraries.map((treatise) => {
      return {
        ...treatise,
      };
    });
    // 搜索埋点
    await this.usersService.recordUserSearchTimes({
      keywords: keyword?.split(';') || [],
      type: Content_Types_Enum.TREATISE_LIBRARY,
      userId: user?.id,
      columnId: columnId || '0',
    });
    return ResultData.ok({
      data: { treatiseLibraries: result, count: count },
    });
  }
  /**
   * @description 推荐精选文库
   * @param {RecommendTreatiseLibrariesDto} params 推荐的相关参数
   * @returns {ResultData} 返回recommendTreatiseLibraries信息
   */
  async recommendTreatiseLibraries(
    params: RecommendTreatiseLibrariesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    const treatiseLibraryInfo = await treatiseLibraryRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    // get columns and isHide = 0
    const columns = await columnsRepository.find({
      where: {
        parentId: In(['column_08']),
        isHide: 0,
      },
      select: ['id', 'name'],
    });
    const sort = treatiseLibraryInfo?.sort;
    const columnId = treatiseLibraryInfo?.columnId;
    let basicCondition =
      'treatiseLibrary.enabled = true and treatiseLibrary.deletedAt is null and treatiseLibrary.status =:status';
    if (treatiseLibraryInfo) {
      basicCondition += ' and treatiseLibrary.id !=:id';
    }
    // if columns is hide, related data is hide
    if (columns && columns.length > 0) {
      basicCondition += ' and treatiseLibrary.columnId in (:...columnIds)';
    }
    if (columns && columns.length === 0) {
      // eslint-disable-next-line quotes
      basicCondition += ` and treatiseLibrary.columnId ='-1'`;
    }
    let treatiseLibrary;
    // sort recommend first
    if (sort) {
      treatiseLibrary = await treatiseLibraryRepository
        .createQueryBuilder('treatiseLibrary')
        .select(['treatiseLibrary.id', 'treatiseLibrary.title', 'treatiseLibrary.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: treatiseLibraryInfo?.id,
          columnIds: columns.map((data) => {
            return data.id;
          }),
        })
        .andWhere('treatiseLibrary.sort =:sort', { sort: sort })
        .andWhere('treatiseLibrary.columnId =:columnId', {
          columnId: columnId,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(8)
        .getMany();
    }
    // if treatiseLibrary count < 8 then columnId recommend
    if (!treatiseLibrary || (treatiseLibrary && treatiseLibrary.length < 8)) {
      let idsCondition = '';
      let size = 8;
      if (treatiseLibrary && treatiseLibrary.length > 0) {
        idsCondition = ' and id not in (:...ids)';
        size = size - treatiseLibrary.length;
      }
      const newTreatiseLibraryLibrary = await treatiseLibraryRepository
        .createQueryBuilder('treatiseLibrary')
        .select(['treatiseLibrary.id', 'treatiseLibrary.title', 'treatiseLibrary.columnId'])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: treatiseLibraryInfo?.id,
          ids: treatiseLibrary
            ? treatiseLibrary.map((data) => {
                return data.id;
              })
            : undefined,
          columnIds: columns.map((data) => {
            return data.id;
          }),
        })
        .andWhere('treatiseLibrary.columnId =:columnId', {
          columnId: columnId,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      treatiseLibrary = _.unionBy(treatiseLibrary, newTreatiseLibraryLibrary, 'id');
    }

    return ResultData.ok({
      data: { treatiseLibraries: treatiseLibrary ? treatiseLibrary : [] },
    });
  }
  /**
   * @description 获取河流图表
   * @param {GetTreatiseLibraryCountBySortAndYearDto} params  获取河流图表的相关参数
   * @returns {ResultData} 返回getTreatiseLibraryCountBySortAndYear信息
   */
  async getTreatiseLibraryCountBySortAndYear(
    params: GetTreatiseLibraryCountBySortAndYearDto
  ): Promise<ResultData> {
    const { columnId } = params;
    //get sortCounts,yearCounts,sorts
    let sortCounts, yearCounts, sorts;
    [sortCounts, yearCounts, sorts] = await Promise.all([
      treatiseLibraryRepository
        .createQueryBuilder('treatise_library')
        .select('COUNT(treatise_library.id)', 'count')
        .addSelect('treatise_library.sort', 'sort')
        .where(
          'treatise_library.enabled = true and treatise_library.deletedAt is null and treatise_library.status =:status and treatise_library.columnId =:columnId',
          {
            columnId: columnId,
            status: Content_Status_Enum.ACTIVE,
          }
        )
        .groupBy('treatise_library.sort')
        .getRawMany(),
      treatiseLibraryRepository
        .createQueryBuilder('treatise_library')
        .select('COUNT(treatise_library.id)', 'count')
        .addSelect('treatise_library.sort', 'sort')
        .addSelect('treatise_library.year', 'year')
        .where(
          'treatise_library.enabled = true and treatise_library.deletedAt is null and treatise_library.status =:status and treatise_library.columnId =:columnId',
          {
            columnId: columnId,
            status: Content_Status_Enum.ACTIVE,
          }
        )
        .groupBy('treatise_library.year')
        .addGroupBy('treatise_library.sort')
        .getRawMany(),
      treatiseLibraryTypesRepository.find({
        where: {
          columnId: columnId,
        },
      }),
    ]);
    sorts = sorts.map((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    });
    sortCounts = _.orderBy(
      sortCounts.map((data) => {
        return {
          sort: data.sort,
          sortName: _.find(sorts, function (o) {
            return o.id === data.sort;
          })?.name,
          count: Number(data.count),
        };
      }),
      'sortName',
      'asc'
    );
    yearCounts = yearCounts.map((data) => {
      return {
        count: Number(data.count),
        sort: data.sort,
        year: data.year,
        sortName: _.find(sorts, function (o) {
          return o.id === data.sort;
        })?.name,
      };
    });
    yearCounts = _.orderBy(
      _.uniqBy(
        yearCounts.map((data) => {
          const yearCount = _.filter(yearCounts, function (o) {
            return o.year === data.year;
          }).map((data) => {
            return {
              sort: data.sort,
              sortName: data.sortName,
              count: data.count,
            };
          });
          return {
            year: data.year,
            count: _.sumBy(yearCount, 'count'),
            sortCounts: _.orderBy(yearCount, 'sortName', 'asc'),
          };
        }),
        'year'
      ),
      'year',
      'asc'
    );
    return ResultData.ok({
      data: { sortCounts: sortCounts, yearCounts: yearCounts },
    });
  }
}
