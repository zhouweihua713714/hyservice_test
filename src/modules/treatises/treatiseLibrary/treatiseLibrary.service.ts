import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  articleTypesRepository,
  columnsRepository,
  languagesRepository,
  treatiseKeywordsRepository,
  treatiseLibraryRepository,
  userHistoryRepository,
  usersRepository,
} from '../../repository/repository';
import {
  GetKeywordChartsDto,
  GetTreatiseLibraryDetailDto,
  ListComplexTreatiseLibraryDto,
  ListTreatiseLibraryDto,
  OperateTreatiseLibrariesDto,
  RecommendTreatiseLibrariesDto,
  RemoveTreatiseLibrariesDto,
  SaveTreatiseLibraryDto,
} from './treatiseLibrary.dto';
import {
  Channels_Enum,
  Content_Status_Enum,
  Content_Types_Enum,
  Labels_Enum,
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
  async getTreatiseLibraryDetail(params: GetTreatiseLibraryDetailDto, user: SignInResInfo): Promise<ResultData> {
    const treatiseInfo = await treatiseLibraryRepository.findOneBy({
      id: params.id,
      deletedAt: IsNull(),
      enabled: true,
    });
    if (!treatiseInfo) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
    }
    const columnInfo = await columnsRepository.findOneBy({ id: treatiseInfo.columnId });
    // get necessary data
    let userInfo;
    let articleTypeInfo;
    if (treatiseInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: treatiseInfo.ownerId });
    }
    if (treatiseInfo.sort) {
      articleTypeInfo = await articleTypesRepository.findBy({
        id:treatiseInfo.sort,
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
      });
    }
    // update clicks
    if (params.flag) {
      await treatiseLibraryRepository.update(params.id, { clicks: treatiseInfo.clicks + 1 });
    }
    // if user login then record history and get user notes by params.id
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.TREATISE,
      });
    }
    const result = {
      columnName: columnInfo ? columnInfo.name : null,
      sortName: articleTypeInfo
        ? _.join(
            articleTypeInfo.map((articleType) => {
              return articleType.name;
            }),
            ';'
          )
        : null,
      owner: userInfo ? userInfo.mobile : null,
      ...treatiseInfo,
    };
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存精选文库
   * @param {SaveTreatiseLibraryDto} params 保存精选文库的相关参数
   * @returns {ResultData} 返回saveTreatiseLibrary信息
   */
  async saveTreatiseLibrary(params: SaveTreatiseLibraryDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, columnId, sort } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if sort not found in database, then throw error
    if (sort) {
      const articleTypeInfo = await articleTypesRepository.findBy({
        id:sort,
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
      });
      if (!articleTypeInfo || (articleTypeInfo && articleTypeInfo.length !== sort.length)) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.SORT_NOT_FOUND_ERROR });
      }
    }
    // if columnId not found in database, then throw error
    const columnInfo = await columnsRepository.findOneBy({ id: columnId });
    if (!columnInfo || (columnInfo && columnInfo.parentId === '0')) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.COLUMN_NOT_FOUND_ERROR });
    }
    if (id) {
      // if id exist get treatiseInfo
      const treatiseInfo = await treatiseLibraryRepository.findOneBy({
        id: params.id,
        deletedAt: IsNull(),
        enabled: true,
      });
      if (!treatiseInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.RESOURCE_NOT_FOUND_ERROR });
      }
    } else {
      params.id = new Date().getTime().toString();
    }
    // const result = await treatiseLibraryRepository.save({
    //   ownerId: user.id,
    //   updatedAt: id ? new Date() : undefined,
    //   publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
    //   ...params,
    // });
    return ResultData.ok({ data: {} });
  }
  /**
   * @description 精选文库列表
   * @param {ListTreatiseLibraryDto} params
   * @returns {ResultData} 返回listTreatiseLibrary信息
   */
  async listTreatiseLibrary(params: ListTreatiseLibraryDto, user: SignInResInfo): Promise<ResultData> {
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
  async operateTreatiseLibraries(params: OperateTreatiseLibrariesDto, user: SignInResInfo): Promise<ResultData> {
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
  async removeTreatiseLibraries(params: RemoveTreatiseLibrariesDto, user: SignInResInfo): Promise<ResultData> {
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
    const {
      keyword,
      sort,
      columnId,
      page,
      size,
    } = params;
    // get basic condition
    let basicCondition =
      'treatiseLibrary.enabled = true and treatiseLibrary.deletedAt is null and treatiseLibrary.status =:status';
    if (columnId) {
      basicCondition += ' and treatiseLibrary.columnId = :columnId';
    }
    if(sort){
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
          sort:sort
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(treatiseLibrary.title) like any (ARRAY[:...keyword])', { keyword: keywords })
              .orWhere('LOWER(treatiseLibrary.keyword) like any (ARRAY[:...keyword])', {
                keyword: keywords,
              })
              .orWhere('(treatiseLibrary.abstract) like any (ARRAY[:...keyword])', { keyword: keywords });
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
          sort:sort
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
    const treatiseInfo = await treatiseLibraryRepository.findOneBy({
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
    const keyword = treatiseInfo?.keyword;
    const columnId = treatiseInfo?.columnId;
    let basicCondition =
      'treatiseLibrary.enabled = true and treatiseLibrary.deletedAt is null and treatiseLibrary.status =:status';
    if (treatiseInfo) {
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
    // keyword recommend first
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.replace(/;/g, '%;%')}%`.split(';');
      treatiseLibrary = await treatiseLibraryRepository
        .createQueryBuilder('treatiseLibrary')
        .select(['treatiseLibrary.id', 'treatiseLibrary.title', 'treatiseLibrary.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: treatiseInfo?.id,
          columnIds: columns.map((data) => {
            return data.id;
          }),
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('treatiseLibrary.keyword like any (ARRAY[:...keyword])', {
              keyword: keywords,
            });
          })
        )
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
          id: treatiseInfo?.id,
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
      data: { treatiseLibrary: treatiseLibrary ? treatiseLibrary : [] },
    });
  }
  /**
   * @description 获取精选文库关键词TOP10(精选文库知识图谱)
   * @param {GetKeywordChartsDto} params  获取精选文库关键词TOP10(精选文库知识图谱)的相关参数
   * @returns {ResultData} 返回getKeywordCharts信息
   */
  async getKeywordCharts(params: GetKeywordChartsDto): Promise<ResultData> {
    const { columnId } = params;
    //get treatiseKeywords by columnId
    const treatiseKeywords = await treatiseKeywordsRepository
      .createQueryBuilder('treatise_keywords')
      .select('COUNT(treatise_keywords.treatiseId)', 'frequency')
      .addSelect('treatise_keywords.name', 'name')
      .where('treatise_keywords.columnId =:columnId', {
        columnId: columnId,
      })
      .groupBy('treatise_keywords.name')
      .getRawMany();
    // get top10
    const keywordTop10 = _.orderBy(
      _.map(treatiseKeywords, (v) => ({
        ...v,
        frequency: Number(v.frequency),
      })),
      ['frequency'],
      ['desc']
    ).slice(0, 10);
    //get title by keyword
    const treatiseKeywordsData = await treatiseKeywordsRepository.find({
      where: {
        name: In(
          keywordTop10.map((data) => {
            return data.name;
          })
        ),
        columnId: columnId,
      },
      select: ['name', 'treatiseId', 'title'],
    });
    const treatiseKeywordsDataDict = _.groupBy(treatiseKeywordsData, 'name');
    const result = keywordTop10.map((data) => {
      return {
        ...data,
        treatiseLibrary: treatiseKeywordsDataDict[data.name]
          ? treatiseKeywordsDataDict[data.name].slice(0, 10)
          : [],
      };
    });
    return ResultData.ok({
      data: { keywordCharts: result },
    });
  }
}
