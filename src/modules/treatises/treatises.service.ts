import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  articleTypesRepository,
  columnsRepository,
  keywordsRepository,
  languagesRepository,
  patentsRepository,
  policiesRepository,
  termKeywordsRepository,
  termsRepository,
  treatiseKeywordsRepository,
  treatisesRepository,
  userFavoriteTreatisesRepository,
  userHistoryRepository,
  userLabelTreatisesRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetInstitutionChartsDto,
  GetTreatiseDetailDto,
  ListComplexTreatiseDto,
  ListTreatiseDto,
  OperateTreatisesDto,
  RecommendTreatisesDto,
  RemoveTreatisesDto,
  SaveTreatiseDto,
} from './treatises.dto';
import {
  Channels_Enum,
  Content_Status_Enum,
  Content_Types_Enum,
  Labels_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Brackets, In, IsNull, Like, Not } from 'typeorm';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TreatiseKeywords } from '@/entities/TreatiseKeywords.entity';
import { UsersService } from '../users/users.service';
@Injectable()
export class TreatisesService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description 获取论文详情
   * @param {GetTreatiseDetailDto} params
   * @returns {ResultData} 返回getTreatiseDetail信息
   */
  async getTreatiseDetail(params: GetTreatiseDetailDto, user: SignInResInfo): Promise<ResultData> {
    const treatiseInfo = await treatisesRepository.findOneBy({
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
    let languageInfo;
    let articleTypeInfo;
    if (treatiseInfo.ownerId) {
      userInfo = await usersRepository.findOneBy({ id: treatiseInfo.ownerId });
    }
    if (treatiseInfo.language) {
      languageInfo = await languagesRepository.findBy({
        id: treatiseInfo.language as string,
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
      });
    }
    if (treatiseInfo.sort) {
      articleTypeInfo = await articleTypesRepository.findBy({
        id: In(treatiseInfo.sort),
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
      });
    }
    // update clicks
    let labelCount: { id: string; count: number }[] = [
      { id: Labels_Enum.Label_001, count: 0 },
      { id: Labels_Enum.Label_002, count: 0 },
      { id: Labels_Enum.Label_003, count: 0 },
      { id: Labels_Enum.Label_004, count: 0 },
    ];
    if (params.flag) {
      await treatisesRepository.update(params.id, { clicks: treatiseInfo.clicks + 1 });
      const userLabels = await userLabelTreatisesRepository
        .createQueryBuilder('userLabelTreatises')
        .select('COUNT(userLabelTreatises.treatiseId)', 'count')
        .addSelect('userLabelTreatises.label', 'label')
        .where('userLabelTreatises.treatiseId =:id', {
          id: params.id,
        })
        .groupBy('userLabelTreatises.label')
        .getRawMany();
      labelCount = labelCount.map((data) => {
        return {
          id: data.id,
          count: _.find(userLabels, function (o) {
            return o.label === data.id;
          })
            ? Number(
                _.find(userLabels, function (o) {
                  return o.label === data.id;
                }).count
              )
            : 0,
        };
      });
    }
    // if user login then record history and get user notes by params.id
    let noteTreatises, userFavorite, userLabel;
    if (params.flag && user) {
      await userHistoryRepository.save({
        userId: user.id,
        relatedId: params.id,
        type: Content_Types_Enum.TREATISE,
      });
      //get user note treatises
      // noteTreatises = await userNoteTreatisesRepository.find({
      //   where: { treatise: { id: params.id }, userId: user.id },
      // });
      // user favorites
      userFavorite = await userFavoriteTreatisesRepository.findOneBy({
        userId: user.id,
        treatise: {
          id: params.id,
        },
      });
      // user label
      userLabel = await userLabelTreatisesRepository.findOneBy({
        treatise: {
          id: params.id,
        },
        userId: user.id,
      });
    }
    const result = {
      languageName: languageInfo
        ? _.join(
            languageInfo.map((language) => {
              return language.name;
            }),
            ';'
          )
        : null,
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
      labels: labelCount,
      ...treatiseInfo,
      // noteTreatises: noteTreatises
      //   ? noteTreatises.map((data) => {
      //       return {
      //         id: data.id,
      //         treatiseId: data.treatiseId,
      //         content: data.content,
      //         updatedAt: data.updatedAt,
      //         comment: data.comment,
      //         commentedAt: data.commentedAt,
      //         title: treatiseInfo.title,
      //         url: treatiseInfo.url,
      //       };
      //     })
      //   : [],
      isFavorite: userFavorite ? 1 : 0,
      label: userLabel ? userLabel.label : null,
    };
    return ResultData.ok({ data: result });
  }
  /**
   * @description 保存论文
   * @param {SaveTreatiseDto} params 保存论文的相关参数
   * @returns {ResultData} 返回saveTreatise信息
   */
  async saveTreatise(params: SaveTreatiseDto, user: SignInResInfo): Promise<ResultData> {
    const { id, status, columnId, language, channel, sort } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }
    // if channel not permitted, then throw error
    if (
      channel &&
      channel !== Channels_Enum.WAY_001 &&
      channel !== Channels_Enum.WAY_002 &&
      channel !== Channels_Enum.WAY_003 &&
      channel !== Channels_Enum.WAY_004
    ) {
      return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.CHANNEL_NOT_FOUND_ERROR });
    }
    // if sort not found in database, then throw error
    if (sort) {
      const articleTypeInfo = await articleTypesRepository.findBy({
        id: In(sort),
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
    // if language not found in database, then throw error
    if (language) {
      const languageInfo = await languagesRepository.findOneBy({
        id: language,
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
      });
      if (!languageInfo) {
        return ResultData.fail({ ...ErrorCode.CONTENT_MANAGEMENT.LANGUAGE_NOT_FOUND_ERROR });
      }
    }

    if (id) {
      // if id exist get treatiseInfo
      const treatiseInfo = await treatisesRepository.findOneBy({
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
    const result = await treatisesRepository.save({
      ownerId: user.id,
      updatedAt: id ? new Date() : undefined,
      publishedAt: status && status === Content_Status_Enum.ACTIVE ? new Date() : null,
      ...params,
    });
    return ResultData.ok({ data: result });
  }
  /**
   * @description 论文列表
   * @param {ListTreatiseDto} params
   * @returns {ResultData} 返回listTreatise信息
   */
  async listTreatise(params: ListTreatiseDto, user: SignInResInfo): Promise<ResultData> {
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
    // get treatises
    const [treatises, count] = await treatisesRepository.findAndCount({
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
      return ResultData.ok({ data: { treatises: [], count: count } });
    }
    // get columns
    const columns = await columnsRepository.find({
      where: {
        id: In(
          treatises.map((treatise) => {
            return treatise.columnId;
          })
        ),
      },
    });
    const result = treatises.map((treatise) => {
      return {
        id: treatise.id,
        title: treatise.title,
        clicks: treatise.clicks,
        status: treatise.status,
        updatedAt: treatise.updatedAt,
        columnName: _.find(columns, function (o) {
          return o.id === treatise.columnId;
        })?.name,
      };
    });
    return ResultData.ok({ data: { treatises: result, count: count } });
  }
  /**
   * @description 操作论文
   * @param {OperateTreatisesDto} params 操作论文的相关参数
   * @returns {ResultData} 返回operateTreatises信息
   */
  async operateTreatises(params: OperateTreatisesDto, user: SignInResInfo): Promise<ResultData> {
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
    const success = await treatisesRepository.find({
      where: { ...statusCondition, id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });

    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await treatisesRepository.update(
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
   * @description 删除论文
   * @param {RemoveTreatisesDto} params 删除论文的相关参数
   * @returns {ResultData} 返回removeTreatises信息
   */
  async removeTreatises(params: RemoveTreatisesDto, user: SignInResInfo): Promise<ResultData> {
    const { ids } = params;
    // if user not permission, then throw error
    if (user.type !== User_Types_Enum.Administrator && user.type !== User_Types_Enum.Admin) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_PERMITTED_ERROR });
    }

    const success = await treatisesRepository.find({
      where: { id: In(ids), enabled: true, deletedAt: IsNull() },
      select: ['id'],
    });
    if (success.length === 0) {
      return ResultData.ok({
        data: { succeed: 0, failed: ids.length },
      });
    }
    // update
    const affected = await treatisesRepository.update(
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
   * @description 获取论文分类下的文章数量
   * @param {} params 获取论文分类下的文章数量的相关参数
   * @returns {ResultData} 返回getArticleCount信息
   */
  async getArticleCount(params: any, user: SignInResInfo): Promise<ResultData> {
    //get columns
    const columns = await columnsRepository.find({
      where: { parentId: 'column_02', isHide: 0 },
      select: ['id', 'name', 'sequenceNumber', 'parentId', 'introduction', 'isHide'],
    });
    // get article count and latest date
    const treatises = await treatisesRepository
      .createQueryBuilder('treatises')
      .select('COUNT(treatises.id)', 'count')
      .addSelect('treatises.columnId', 'columnId')
      .addSelect(
        'MAX(floor(EXTRACT(epoch FROM CAST(treatises.updatedAt AS TIMESTAMP WITH TIME ZONE))*1000))',
        'updatedAt'
      )
      .where(
        'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status',
        {
          status: Content_Status_Enum.ACTIVE,
        }
      )
      .groupBy('treatises.columnId')
      .getRawMany();
    //get return data
    const result = columns.map((column) => {
      const count = _.find(treatises, function (o) {
        return o.columnId === column.id;
      })?.count;
      const updatedAt = _.find(treatises, function (o) {
        return o.columnId === column.id;
      })?.updatedAt;
      return {
        ...column,
        count: count ? Number(count) : 0,
        updatedAt: updatedAt ? new Date(Number(updatedAt)) : null,
      };
    });
    return ResultData.ok({
      data: { columns: result },
    });
  }
  /**
   * @description 论文列表(c端)
   * @param {} params 论文列表(c端)的相关参数
   * @returns {ResultData} 返回listComplexTreatise信息
   */
  async listComplexTreatise(
    params: ListComplexTreatiseDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { keyword, columnId, deliveryAt, releasedAt, page, size } = params;
    let orderCondition = 'treatises.deliveryAt';
    // get basic condition
    let basicCondition =
      'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status';
    if (deliveryAt) {
      basicCondition += ' and treatises.year = :year';
    }
    if (releasedAt) {
      basicCondition += ' and extract(year from treatises.releasedAt) = :releasedAt';
    }
    if (columnId) {
      basicCondition += ' and treatises.columnId = :columnId';
      if (columnId === 'column_02_03') {
        orderCondition = 'treatises.releasedAt';
      }
    }
    // get treatises and count
    let treatises;
    let count;
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.replace(';', '%;%')}%`.split(';');
      [treatises, count] = await treatisesRepository
        .createQueryBuilder('treatises')
        .select([
          'treatises.id',
          'treatises.title',
          'treatises.deliveryAt',
          'treatises.author',
          'treatises.authorAbbreviation',
          'treatises.name',
          'treatises.abstract',
          'treatises.keyword',
          'treatises.periodical',
          'treatises.releasedAt',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
          year: deliveryAt ? new Date(deliveryAt).getFullYear() : undefined,
          releasedAt: releasedAt ? new Date(releasedAt).getFullYear() : undefined,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('treatises.title like any (ARRAY[:...keyword])', { keyword: keywords })
              .orWhere('treatises.keyword like any (ARRAY[:...keyword])', { keyword: keywords })
              .orWhere('treatises.abstract like any (ARRAY[:...keyword])', { keyword: keywords });
          })
        )
        .orderBy(`${orderCondition}`, 'DESC')
        .addOrderBy('treatises.publishedAt', 'DESC')
        .addOrderBy('treatises.id', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    } else {
      [treatises, count] = await treatisesRepository
        .createQueryBuilder('treatises')
        .select([
          'treatises.id',
          'treatises.title',
          'treatises.deliveryAt',
          'treatises.author',
          'treatises.authorAbbreviation',
          'treatises.name',
          'treatises.abstract',
          'treatises.keyword',
          'treatises.periodical',
          'treatises.releasedAt',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
          year: deliveryAt ? new Date(deliveryAt).getFullYear() : undefined,
          releasedAt: releasedAt ? new Date(releasedAt).getFullYear() : undefined,
        })
        .orderBy(`${orderCondition}`, 'DESC')
        .addOrderBy('treatises.publishedAt', 'DESC')
        .addOrderBy('treatises.id', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
    }
    if (count === 0) {
      return ResultData.ok({
        data: { treatises: [], count: 0 },
      });
    }
    // get user favorites labels
    let userFavorites;
    let userLabels;
    if (user) {
      // user favorites
      userFavorites = await userFavoriteTreatisesRepository.find({
        where: {
          userId: user.id,
          treatise: {
            id: In(
              treatises.map((treatise) => {
                return treatise.id;
              })
            ),
          },
        },
      });
      // user labels
      userLabels = await userLabelTreatisesRepository.find({
        where: {
          treatise: {
            id: In(
              treatises.map((treatise) => {
                return treatise.id;
              })
            ),
          },
        },
      });
    }
    const labels = _.groupBy(userLabels, 'treatiseId');
    const result = treatises.map((treatise) => {
      // get maxCount
      let labelCount: { id: string; count: number }[] = [
        { id: Labels_Enum.Label_001, count: 0 },
        { id: Labels_Enum.Label_002, count: 0 },
        { id: Labels_Enum.Label_003, count: 0 },
        { id: Labels_Enum.Label_004, count: 0 },
      ];
      if (labels[treatise.id]) {
        const groupLabels = _.groupBy(labels[treatise.id], 'label');
        labelCount = labelCount.map((data) => {
          return {
            id: data.id,
            count: groupLabels[data.id] ? groupLabels[data.id].length : 0,
          };
        });
      }
      const maxCount = _.maxBy(labelCount, 'count');
      return {
        ...treatise,
        label: maxCount && maxCount.count !== 0 ? maxCount.id : null,
        isFavorite: _.find(userFavorites, function (o) {
          return o.treatiseId === treatise.id;
        })
          ? 1
          : 0,
      };
    });
    // 搜索埋点
    await this.usersService.recordUserSearchTimes({
      keywords: keyword?.split(';') || [],
      type: Content_Types_Enum.TREATISE,
      userId: user?.id,
      columnId: columnId || '0',
    });
    return ResultData.ok({
      data: { treatises: result, count: count },
    });
  }
  /**
   * @description 推荐论文
   * @param {RecommendTreatisesDto} params 推荐的相关参数
   * @returns {ResultData} 返回recommendTreatises信息
   */
  async recommendTreatises(
    params: RecommendTreatisesDto,
    user: SignInResInfo
  ): Promise<ResultData> {
    const { id } = params;
    const treatiseInfo = await treatisesRepository.findOneBy({
      id: id,
      status: Content_Status_Enum.ACTIVE,
      deletedAt: IsNull(),
      enabled: true,
    });
    const keyword = treatiseInfo?.keyword;
    const columnId = treatiseInfo?.columnId;
    let basicCondition =
      'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status';
    if (treatiseInfo) {
      basicCondition += ' and treatises.id !=:id';
    }
    let treatises;
    // keyword recommend first
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.replace(';', '%;%')}%`.split(';');
      treatises = await treatisesRepository
        .createQueryBuilder('treatises')
        .select(['treatises.id', 'treatises.title', 'treatises.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: treatiseInfo?.id,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('treatises.keyword like any (ARRAY[:...keyword])', {
              keyword: keywords,
            });
          })
        )
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(8)
        .getMany();
    }
    // if treatises count < 8 then columnId recommend
    if (!treatises || (treatises && treatises.length < 8)) {
      let idsCondition = '';
      let size = 8;
      if (treatises && treatises.length > 0) {
        idsCondition = ' and id not in (:...ids)';
        size = size - treatises.length;
      }
      const newTreatises = await treatisesRepository
        .createQueryBuilder('treatises')
        .select(['treatises.id', 'treatises.title', 'treatises.columnId'])
        .where(`${basicCondition}${idsCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: treatiseInfo?.id,
          ids: treatises
            ? treatises.map((data) => {
                return data.id;
              })
            : undefined,
        })
        .andWhere('treatises.columnId =:columnId', {
          columnId: columnId,
        })
        .orderBy('RANDOM()') // it isn't a good function that treatise become a large of data
        .take(size)
        .getMany();
      treatises = _.unionBy(treatises, newTreatises, 'id');
    }
    return ResultData.ok({
      data: { treatises: treatises ? treatises : [] },
    });
  }

  /**
   * @description 文献发表机构排名(TOP10)
   * @param {GetInstitutionChartsDto} params 文献发表机构排名(TOP10)的相关参数
   * @returns {ResultData} 返回getInstitutionCharts信息
   */
  async getInstitutionCharts(params: GetInstitutionChartsDto): Promise<ResultData> {
    const { columnId } = params;
    // ssci
    let condition = 'treatises.authorUnit';
    if (columnId === 'column_02_03') {
      condition = 'treatises.authorAddress';
    }
    // get article count and latest date
    let treatises = await treatisesRepository
      .createQueryBuilder('treatises')
      .select('COUNT(treatises.id)', 'count')
      .addSelect(condition, 'name')
      .where(
        'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status and treatises.columnId =:columnId',
        {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
        }
      )
      .groupBy(condition)
      .getRawMany();

    // get number count
    treatises = treatises.map((data) => {
      return {
        name: data.name,
        count: Number(data.count),
      };
    });
    // filter null and get order
    treatises = _.orderBy(
      _.filter(treatises, function (o) {
        return o.name;
      }),
      'count',
      'desc'
    );
    // get top 10
    treatises = treatises.slice(0, 10);
    return ResultData.ok({
      data: { institutionCharts: treatises },
    });
  }
  /**
   * @description 获取内容管理相关的关键词数据脚本
   * @param {} params  获取内容管理相关的关键词数据脚本的相关参数
   * @returns {ResultData} 返回getKeywords信息
   */
  async getKeywords(params: any): Promise<ResultData> {
    // getTreatise
    // console.time('queryTime');
    // const treatises = await treatisesRepository.find({
    //   where: {
    //     status: Content_Status_Enum.ACTIVE,
    //     deletedAt: IsNull(),
    //     enabled: true,
    //     keyword: Not(IsNull()),
    //   },
    //   select: ['keyword'],
    // });
    // console.timeEnd('queryTime');
    // console.time('keywords');
    // let keywords: { id: string; name: string; frequency: number }[] = [];
    // for (let i = 0; i < treatises.length; i++) {
    //   if (treatises[i].keyword) {
    //     const keyword = treatises[i].keyword
    //       ?.replace(/\+/g, '')
    //       .split(';')
    //       .map((data) => {
    //         return {
    //           id: uuidv4(),
    //           name: data.toLowerCase().trim(),
    //           frequency: 0,
    //           type: Content_Types_Enum.TREATISE,
    //         };
    //       });
    //     keywords = _.unionBy(keywords, keyword, 'id');
    //   }
    // }
    // const keyword = _.uniqBy(
    //   keywords.map((data) => {
    //     return { name: data.name, frequency: 0, type: Content_Types_Enum.TREATISE };
    //   }),
    //   'name'
    // );
    // console.timeEnd('keywords');
    // console.time('countTime');
    // for (let i = 0; i < keyword.length; i++) {
    //   for (let j = 0; j < keywords.length; j++) {
    //     if (keyword[i].name === keywords[j].name) {
    //       keyword[i].frequency++;
    //     }
    //   }
    // }
    // const treatiseKeywords = _.orderBy(keyword, 'frequency', 'desc');
    // console.timeEnd('countTime');
    // console.log('treatise', treatiseKeywords.length, treatiseKeywords[0]);
    // // insert
    // console.time('insert');
    // for (let i = 0; i < treatiseKeywords.length; i++) {
    //   await keywordsRepository.save(treatiseKeywords[i]);
    // }
    // console.timeEnd('insert');
    // getTreatise
    // console.log('-------------------------------');
    // console.time('termQueryTime');
    // const terms = await termsRepository.find({
    //   where: {
    //     status: Content_Status_Enum.ACTIVE,
    //     deletedAt: IsNull(),
    //     enabled: true,
    //     keyword: Not(IsNull()),
    //   },
    //   select: ['keyword'],
    // });
    // console.timeEnd('termQueryTime');
    // console.time('keywords');
    // let keywords: { id: string; name: string; frequency: number }[] = [];
    // for (let i = 0; i < terms.length; i++) {
    //   if (terms[i].keyword) {
    //     const keyword = terms[i].keyword
    //       ?.replace(/\+/g, '')
    //       .split(';')
    //       .map((data) => {
    //         return {
    //           id: uuidv4(),
    //           name: data.toLowerCase().trim(),
    //           frequency: 0,
    //           type: Content_Types_Enum.TERM,
    //         };
    //       });
    //     keywords = _.unionBy(keywords, keyword, 'id');
    //   }
    // }
    // const keyword = _.uniqBy(
    //   keywords.map((data) => {
    //     return { name: data.name, frequency: 0, type: Content_Types_Enum.TERM };
    //   }),
    //   'name'
    // );
    // console.timeEnd('keywords');
    // console.time('countTime');
    // for (let i = 0; i < keyword.length; i++) {
    //   for (let j = 0; j < keywords.length; j++) {
    //     if (keyword[i].name === keywords[j].name) {
    //       keyword[i].frequency++;
    //     }
    //   }
    // }
    // const termKeywords = _.orderBy(keyword, 'frequency', 'desc');
    // console.timeEnd('countTime');
    // console.log('term:', termKeywords.length, termKeywords[0]);
    // // insert
    // console.time('insert');
    // for (let i = 0; i < termKeywords.length; i++) {
    //   await keywordsRepository.save(termKeywords[i]);
    // }
    // console.timeEnd('insert');
    // console.log('-------------------------------');
    // console.time('policyQueryTime');
    // const policies = await policiesRepository.find({
    //   where: {
    //     status: Content_Status_Enum.ACTIVE,
    //     deletedAt: IsNull(),
    //     enabled: true,
    //     keyword: Not(IsNull()),
    //   },
    //   select: ['keyword'],
    // });
    // console.timeEnd('policyQueryTime');
    // console.time('keywords');
    // let keywords: { id: string; name: string; frequency: number }[] = [];
    // for (let i = 0; i < policies.length; i++) {
    //   if (policies[i].keyword) {
    //     const keyword = policies[i].keyword
    //       ?.replace(/\+/g, '')
    //       .split(';')
    //       .map((data) => {
    //         return {
    //           id: uuidv4(),
    //           name: data.toLowerCase(),
    //           frequency: 0,
    //           type: Content_Types_Enum.POLICY,
    //         };
    //       });
    //     keywords = _.unionBy(keywords, keyword, 'id');
    //   }
    // }
    // const keyword = _.uniqBy(
    //   keywords.map((data) => {
    //     return { name: data.name, frequency: 0, type: Content_Types_Enum.POLICY };
    //   }),
    //   'name'
    // );
    // console.timeEnd('keywords');
    // console.time('countTime');
    // for (let i = 0; i < keyword.length; i++) {
    //   for (let j = 0; j < keywords.length; j++) {
    //     if (keyword[i].name === keywords[j].name) {
    //       keyword[i].frequency++;
    //     }
    //   }
    // }
    // const policyKeywords = _.orderBy(keyword, 'frequency', 'desc');
    // console.timeEnd('countTime');
    // console.log('policy:', policyKeywords.length, policyKeywords[0]);
    // // insert
    // console.time('insert');
    // for (let i = 0; i < policyKeywords.length; i++) {
    //   await keywordsRepository.save(policyKeywords[i]);
    // }
    // console.timeEnd('insert');
    // console.log('-------------------------------');
    // console.time('patentQueryTime');
    // const patents = await patentsRepository.find({
    //   where: {
    //     status: Content_Status_Enum.ACTIVE,
    //     deletedAt: IsNull(),
    //     enabled: true,
    //     keyword: Not(IsNull()),
    //   },
    //   select: ['id', 'keyword'],
    // });
    // console.timeEnd('patentQueryTime');
    // console.time('keywords');
    // // let count = 0;
    // let keywords: { id: string; name: string; frequency: number }[] = [];
    // for (let i = 0; i < patents.length; i++) {
    //   if (patents[i].keyword) {
    //     patents[i].keyword = patents[i].keyword?.replace(/(^;)|(;$)/, '') || null;
    //     const keyword = patents[i].keyword
    //       ?.replace(/\+/g, '')
    //       .split(';')
    //       .map((data) => {
    //         return {
    //           id: uuidv4(),
    //           name: data.toLowerCase().trim(),
    //           frequency: 0,
    //           type: Content_Types_Enum.PATENT,
    //         };
    //       });
    //     keywords = _.unionBy(keywords, keyword, 'id');
    //     // const result = await patentsRepository.save(patents[i]);
    //     // if (result) {
    //     //   count++;
    //     // }
    //   }
    // }
    // const keyword = _.uniqBy(
    //   keywords.map((data) => {
    //     return { name: data.name, frequency: 0, type: Content_Types_Enum.PATENT };
    //   }),
    //   'name'
    // );
    // // console.log('patentCount:', count);
    // console.timeEnd('keywords');
    // console.time('countTime');
    // for (let i = 0; i < keyword.length; i++) {
    //   for (let j = 0; j < keywords.length; j++) {
    //     if (keyword[i].name === keywords[j].name) {
    //       keyword[i].frequency++;
    //     }
    //   }
    // }
    // const patentKeywords = _.orderBy(keyword, 'frequency', 'desc');
    // console.timeEnd('countTime');
    // console.log('patent:', patentKeywords.length, patentKeywords[0]);
    // // insert
    // console.time('insert');
    // for (let i = 0; i < patentKeywords.length; i++) {
    //   await keywordsRepository.save(patentKeywords[i]);
    // }
    // console.timeEnd('insert');
    //以下代码块需要做定时任务
    //getTreatise
    // console.time('查询时间');
    // const treatises = await treatisesRepository.find({
    //   where: {
    //     status: Content_Status_Enum.ACTIVE,
    //     deletedAt: IsNull(),
    //     enabled: true,
    //     keyword: Not(IsNull()),
    //   },
    //   select: ['keyword', 'id', 'title', 'columnId'],
    // });
    // console.timeEnd('查询时间');
    // console.time('数据准备时间');
    // //预插入到treatiseKeywords的数组
    // let keywords: {
    //   id: string;
    //   name: string;
    //   columnId: string;
    //   title: string;
    //   treatiseId: string;
    // }[] = [];
    // for (let i = 0; i < treatises.length; i++) {
    //   if (treatises[i].keyword) {
    //     const keyword = treatises[i].keyword
    //       ?.replace(/\+/g, '')
    //       .split(';')
    //       .map((data) => {
    //         return {
    //           id: uuidv4(),
    //           name: data.toLowerCase().trim(),
    //           columnId: treatises[i].columnId,
    //           title: treatises[i].title,
    //           treatiseId: treatises[i].id,
    //         };
    //       });
    //     keywords = _.unionBy(keywords, keyword, 'id');
    //   }
    // }
    // console.timeEnd('数据准备时间');
    // console.log(
    //   'treatiseCount',
    //   treatises.length,
    //   'keywords:',
    //   keywords.length,
    //   'keywords[0]',
    //   keywords[0]
    // );
    // //插入之前每次清空表
    // await treatiseKeywordsRepository.delete({});
    // // insert 这里逐条插入是因为批量插入会有最大限制且当前论文数据量大批量插入需要分组所以直接单条插入更方便；
    // console.time('插入执行时间');
    // for (let i = 0; i < keywords.length; i++) {
    //   await treatiseKeywordsRepository.save(keywords[i]);
    // }
    // console.timeEnd('插入执行时间');
    // console.log(
    //   'treatiseCount',
    //   treatises.length,
    //   'keywords:',
    //   keywords.length,
    //   'keywords[0]',
    //   keywords[0]
    // );
    //getTreatise
    // console.time('查询时间');
    // const terms = await termsRepository.find({
    //   where: {
    //     status: Content_Status_Enum.ACTIVE,
    //     deletedAt: IsNull(),
    //     enabled: true,
    //     keyword: Not(IsNull()),
    //   },
    //   select: ['keyword', 'id', 'columnId'],
    // });
    // console.timeEnd('查询时间');
    // console.time('数据准备时间');
    // //预插入到termKeywords的数组
    // let termKeywords: {
    //   id: string;
    //   name: string;
    //   columnId: string;
    //   termId: string;
    // }[] = [];
    // for (let i = 0; i < terms.length; i++) {
    //   if (terms[i].keyword) {
    //     const keyword = terms[i].keyword
    //       ?.replace(/\+/g, '')
    //       .split(';')
    //       .map((data) => {
    //         return {
    //           id: uuidv4(),
    //           name: data.toLowerCase(),
    //           columnId: terms[i].columnId,
    //           termId: terms[i].id,
    //         };
    //       });
    //     termKeywords = _.unionBy(termKeywords, keyword, 'id');
    //   }
    // }
    // console.timeEnd('数据准备时间');
    // console.log(
    //   'termsCount',
    //   terms.length,
    //   'keywords:',
    //   termKeywords.length,
    //   'keywords[0]',
    //   termKeywords[0]
    // );
    // //插入之前每次清空表
    // await termKeywordsRepository.delete({});
    // // insert 这里逐条插入是因为批量插入会有最大限制且当前论文数据量大批量插入需要分组所以直接单条插入更方便；
    // console.time('插入执行时间');
    // let insertCount = 0;
    // for (let i = 0; i < termKeywords.length; i++) {
    //   if (termKeywords[i].name.replace(/\+/g, '')) {
    //     await termKeywordsRepository.save(termKeywords[i]);
    //     insertCount++;
    //   }
    // }
    // console.timeEnd('插入执行时间');
    // console.log('insertCount', insertCount);

    return ResultData.ok({
      data: { keywords: [] },
    });
  }

  /**
   * @description 获取论文关键词TOP10(论文知识图谱)
   * @param {GetInstitutionChartsDto} params  获取论文关键词TOP10(论文知识图谱)的相关参数
   * @returns {ResultData} 返回getKeywordCharts信息
   */
  async getKeywordCharts(params: GetInstitutionChartsDto): Promise<ResultData> {
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
    // const keywords = await keywordsRepository.find({
    //   where: {
    //     type: Content_Types_Enum.TREATISE,
    //   },
    // });
    // //get map for get search
    // const keywordsDict = _.keyBy(keywords, (v) => v.name);
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
        treatises: treatiseKeywordsDataDict[data.name]
          ? treatiseKeywordsDataDict[data.name].slice(0, 10)
          : [],
      };
    });
    return ResultData.ok({
      data: { keywordCharts: result },
    });
  }
}
