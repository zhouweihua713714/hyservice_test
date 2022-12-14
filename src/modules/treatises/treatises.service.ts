import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  articleTypesRepository,
  columnsRepository,
  languagesRepository,
  treatiseKeywordsRepository,
  treatisesRepository,
  userFavoriteTreatisesRepository,
  userHistoryRepository,
  userLabelTreatisesRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetInstitutionChartsDto,
  GetKeywordChartsDto,
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
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
        columnId: treatise.columnId,
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
    const {
      keyword,
      columnId,
      deliveryAt,
      releasedAt,
      startYear,
      endYear,
      topic,
      childTopic,
      goal,
      object,
      paradigm,
      method,
      page,
      size,
    } = params;
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
      if (columnId === 'column_02_03' || columnId === 'column_02_02') {
        orderCondition = 'treatises.releasedAt';
      }
    }
    if (startYear) {
      basicCondition += ' and extract(year from treatises.releasedAt) >= :startYear';
    }
    if (endYear) {
      basicCondition += ' and extract(year from treatises.releasedAt) <= :endYear';
    }
    if (topic) {
      basicCondition += ' and treatises.topic = :topic';
    }
    if (childTopic) {
      basicCondition += ' and treatises.childTopic = :childTopic';
    }
    if (goal) {
      basicCondition += ' and treatises.goal = :goal';
    }
    if (object) {
      basicCondition += ' and treatises.object like :object';
    }
    if (paradigm) {
      basicCondition += ' and treatises.paradigm = :paradigm';
    }
    if (method) {
      basicCondition += ' and treatises.method like :method';
    }
    // get treatises and count
    let treatises;
    let count;
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.toLowerCase().replace(/;/g, '%;%')}%`.split(';');
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
          'treatises.channel',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
          year: deliveryAt ? new Date(deliveryAt).getFullYear() : undefined,
          releasedAt: releasedAt ? new Date(releasedAt).getFullYear() : undefined,
          startYear: startYear,
          endYear: endYear,
          topic: topic,
          childTopic: childTopic,
          goal: goal,
          object: `%${object}%`,
          paradigm: paradigm,
          method: `%${method}%`,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(treatises.title) like any (ARRAY[:...keyword])', { keyword: keywords })
              .orWhere('LOWER(treatises.keyword) like any (ARRAY[:...keyword])', {
                keyword: keywords,
              })
              .orWhere('(treatises.abstract) like any (ARRAY[:...keyword])', { keyword: keywords });
          })
        )
        .orderBy(`${orderCondition}`, 'DESC', 'NULLS LAST')
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
          'treatises.channel',
        ])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId,
          year: deliveryAt ? new Date(deliveryAt).getFullYear() : undefined,
          releasedAt: releasedAt ? new Date(releasedAt).getFullYear() : undefined,
          startYear: startYear,
          endYear: endYear,
          topic: topic,
          childTopic: childTopic,
          goal: goal,
          object: `%${object}%`,
          paradigm: paradigm,
          method: `%${method}%`,
        })
        .orderBy(`${orderCondition}`, 'DESC', 'NULLS LAST')
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
    // get columns and isHide = 0
    const columns = await columnsRepository.find({
      where: {
        parentId: In(['column_02']),
        id: treatiseInfo?.columnId,
        isHide: 0,
      },
      select: ['id', 'name'],
    });
    const keyword = treatiseInfo?.keyword;
    const columnId = treatiseInfo?.columnId;
    let basicCondition =
      'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status';
    if (treatiseInfo) {
      basicCondition += ' and treatises.id !=:id';
    }
    // if columns is hide, related data is hide
    if (columns && columns.length > 0) {
      basicCondition += ' and treatises.columnId in (:...columnIds)';
    }
    if (columns && columns.length === 0) {
      // eslint-disable-next-line quotes
      basicCondition += ` and treatises.columnId ='-1'`;
    }
    let treatises;
    // keyword recommend first
    if (keyword) {
      // get keywords
      const keywords = `%${keyword.replace(/;/g, '%;%')}%`.split(';');
      treatises = await treatisesRepository
        .createQueryBuilder('treatises')
        .select(['treatises.id', 'treatises.title', 'treatises.columnId'])
        .where(`${basicCondition}`, {
          status: Content_Status_Enum.ACTIVE,
          id: treatiseInfo?.id,
          columnIds: columns.map((data) => {
            return data.id;
          }),
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
          columnIds: columns.map((data) => {
            return data.id;
          }),
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
   * @description 获取论文关键词TOP10(论文知识图谱)
   * @param {GetKeywordChartsDto} params  获取论文关键词TOP10(论文知识图谱)的相关参数
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
        treatises: treatiseKeywordsDataDict[data.name]
          ? treatiseKeywordsDataDict[data.name].slice(0, 10)
          : [],
      };
    });
    return ResultData.ok({
      data: { keywordCharts: result },
    });
  }
  /**
   * @description 获取国家间的合作关系(NS)
   * @param {} params  获取国家间的合作关系(NS)相关参数
   * @returns {ResultData} 返回getCountryCooperationNetWorks信息
   */
  async getCountryCooperationNetWorks(params: any): Promise<ResultData> {
    const { columnId } = params;
    // get treatises
    const treatises = await treatisesRepository.find({
      where: {
        status: Content_Status_Enum.ACTIVE,
        deletedAt: IsNull(),
        enabled: true,
        columnId: columnId ? columnId : 'column_02_02', //NS
      },
      select: ['title', 'region', 'id'],
    });
    //get region data
    let treatiseData: { region: string; title: string; id: string; treatiseId: string }[] = [];
    treatises.map((data) => {
      let region;
      if (data.region) {
        region = data.region.split(';').map((miniData) => {
          return {
            region: miniData,
            title: data.title,
            treatiseId: data.id,
            id: uuidv4(),
          };
        });
        treatiseData = _.unionBy(treatiseData, region);
      }
    });
    // group by
    const groupByTreatise = _.groupBy(treatiseData, 'region');
    // get regions
    const regions = _.orderBy(
      _.uniqBy(treatiseData, 'region').map((data) => {
        return {
          region: data.region,
          treatises: groupByTreatise[data.region]
            ? groupByTreatise[data.region].map((data) => {
                return { title: data.title, id: data.treatiseId };
              })
            : [],
        };
      }),
      'region',
      'asc'
    );
    return ResultData.ok({
      data: { regions: regions },
    });
  }
  /**
   * @description 获取年份下的论文数量(NS)
   * @param {} params  获取年份下的论文数量(NS)相关参数
   * @returns {ResultData} 返回getTreatiseCountByYear信息
   */
  async getTreatiseCountByYear(params: any): Promise<ResultData> {
    const { columnId } = params;
    // get treatise count
    let treatises = await treatisesRepository
      .createQueryBuilder('treatises')
      .select('COUNT(treatises.id)', 'count')
      .addSelect('extract(year from treatises.releasedAt)', 'year')
      .where(
        'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status and treatises.columnId =:columnId',
        {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId ? columnId : 'column_02_02',
        }
      )
      .groupBy('extract(year from treatises.releasedAt)')
      .getRawMany();
    treatises = _.orderBy(
      treatises.map((data) => {
        return {
          count: Number(data.count),
          year: Number(data.year),
        };
      }),
      'year',
      'asc'
    );
    // it's up to PM
    let yearCounts = [
      { startYear: 1982, endYear: 1986, count: 0 },
      { startYear: 1987, endYear: 1991, count: 0 },
      { startYear: 1992, endYear: 1996, count: 0 },
      { startYear: 1997, endYear: 2001, count: 0 },
      { startYear: 2002, endYear: 2006, count: 0 },
      { startYear: 2007, endYear: 2011, count: 0 },
      { startYear: 2012, endYear: 2016, count: 0 },
      { startYear: 2017, endYear: 2021, count: 0 },
    ];
    yearCounts = yearCounts.map((data) => {
      return {
        startYear: data.startYear,
        endYear: data.endYear,
        count: _.sumBy(
          _.filter(treatises, function (o) {
            return o.year >= data.startYear && o.year <= data.endYear;
          }),
          'count'
        ),
        name: data.startYear + '-' + data.endYear,
      };
    });
    return ResultData.ok({
      data: { yearCounts: yearCounts },
    });
  }
  /**
   * @description 获取主题分布数据(NS)
   * @param {} params  获取主题分布数据(NS)相关参数
   * @returns {ResultData} 返回getResearchTopics信息
   */
  async getResearchTopics(params: any): Promise<ResultData> {
    const { columnId } = params;
    // get treatises
    const treatises = await treatisesRepository.find({
      where: {
        status: Content_Status_Enum.ACTIVE,
        deletedAt: IsNull(),
        enabled: true,
        columnId: columnId ? columnId : 'column_02_02', //NS
      },
      select: ['topic', 'childTopic', 'id'],
    });
    // group by
    const groupByTreatise = _.groupBy(treatises, 'topic');
    // get topic
    const topics = _.orderBy(
      _.uniqBy(treatises, 'topic').map((data) => {
        return {
          topic: data.topic,
          count: _.filter(treatises, function (o) {
            return o.topic === data.topic;
          }).length,
          childTopics:
            data.topic && groupByTreatise[data.topic]
              ? _.uniqBy(
                  _.filter(
                    groupByTreatise[data.topic].map((data) => {
                      return {
                        topic: data.childTopic,
                        count: _.filter(treatises, function (o) {
                          return o.childTopic === data.childTopic;
                        }).length,
                      };
                    }),
                    function (o) {
                      return o.topic;
                    }
                  ),
                  'topic'
                )
              : [],
        };
      }),
      'topic',
      'asc'
    );
    return ResultData.ok({
      data: { topics: topics },
    });
  }
  /**
   * @description 获取研究对象下的论文数量(NS)
   * @param {} params  获取主题分布数据(NS)相关参数
   * @returns {ResultData} 返回getResearchObjects信息
   */
  async getResearchObjects(params: any): Promise<ResultData> {
    const { columnId } = params;
    // get treatises
    const treatises = await treatisesRepository.find({
      where: {
        status: Content_Status_Enum.ACTIVE,
        deletedAt: IsNull(),
        enabled: true,
        columnId: columnId ? columnId : 'column_02_02', //NS
        object: Not(IsNull()),
      },
      select: ['object', 'id'],
    });
    //get object data
    let treatiseData: { object: string; id: string; treatiseId: string }[] = [];
    treatises.map((data) => {
      let object;
      if (data.object) {
        object = data.object.split(';').map((miniData) => {
          return {
            object: miniData,
            treatiseId: data.id,
            id: uuidv4(),
          };
        });
        treatiseData = _.unionBy(treatiseData, object);
      }
    });
    const groupByTreatise = _.groupBy(treatiseData, 'object');
    const objects = _.orderBy(
      _.uniqBy(treatiseData, 'object').map((data) => {
        return {
          object: data.object,
          count: groupByTreatise[data.object] ? groupByTreatise[data.object].length : 0,
        };
      }),
      'object',
      'asc'
    );
    return ResultData.ok({
      data: { objects: objects },
    });
  }
  /**
   * @description 获取各研究范式的论文总数以及占比(NS)
   * @param {} params  获取各研究范式的论文总数以及占比(NS)相关参数
   * @returns {ResultData} 返回getResearchParadigm信息
   */
  async getResearchParadigm(params: any): Promise<ResultData> {
    const { columnId } = params;
    let treatises = await treatisesRepository
      .createQueryBuilder('treatises')
      .select('COUNT(treatises.id)', 'count')
      .addSelect('treatises.paradigm', 'paradigm')
      .where(
        'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status and treatises.columnId =:columnId',
        {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId ? columnId : 'column_02_02',
        }
      )
      .groupBy('treatises.paradigm')
      .getRawMany();
    treatises = _.orderBy(
      treatises.map((data) => {
        return {
          paradigm: data.paradigm,
          count: Number(data.count),
          percent: Number(
            (
              (Number(data.count) /
                _.sumBy(
                  treatises.map((data) => {
                    return { count: Number(data.count) };
                  }),
                  'count'
                )) *
              100
            ).toFixed(2)
          ),
        };
      }),
      'paradigm',
      'asc'
    );
    return ResultData.ok({
      data: { paradigm: treatises },
    });
  }
  /**
   * @description 获取各研究目标得总数及占比(NS)
   * @param {} params  获取各研究目标得总数及占比(NS)相关参数
   * @returns {ResultData} 返回getResearchGoals信息
   */
  async getResearchGoals(params: any): Promise<ResultData> {
    const { columnId } = params;
    let treatises = await treatisesRepository
      .createQueryBuilder('treatises')
      .select('COUNT(treatises.id)', 'count')
      .addSelect('treatises.goal', 'goal')
      .where(
        'treatises.enabled = true and treatises.deletedAt is null and treatises.status =:status and treatises.columnId =:columnId and treatises.goal is not null',
        {
          status: Content_Status_Enum.ACTIVE,
          columnId: columnId ? columnId : 'column_02_02',
        }
      )
      .groupBy('treatises.goal')
      .getRawMany();
    treatises = _.orderBy(
      treatises.map((data) => {
        return {
          goal: data.goal,
          count: Number(data.count),
          percent: Number(
            (
              (Number(data.count) /
                _.sumBy(
                  treatises.map((data) => {
                    return { count: Number(data.count) };
                  }),
                  'count'
                )) *
              100
            ).toFixed(2)
          ),
        };
      }),
      'goal',
      'asc'
    );
    return ResultData.ok({
      data: { goals: treatises },
    });
  }
  /**
   * @description 获取各数据分析方法数量以及占比(NS)
   * @param {} params  取各数据分析方法数量以及占比(NS)相关参数
   * @returns {ResultData} 返回getResearchAnalysisMethods信息
   */
  async getResearchAnalysisMethods(params: any): Promise<ResultData> {
    const { columnId } = params;
    // get treatises
    const treatises = await treatisesRepository.find({
      where: {
        status: Content_Status_Enum.ACTIVE,
        deletedAt: IsNull(),
        enabled: true,
        columnId: columnId ? columnId : 'column_02_02', //NS
        method: Not(IsNull()),
      },
      select: ['method', 'id'],
    });
    //get method data
    let treatiseData: { method: string; id: string; treatiseId: string }[] = [];
    treatises.map((data) => {
      let method;
      if (data.method) {
        method = data.method.split(';').map((miniData) => {
          return {
            method: miniData,
            treatiseId: data.id,
            id: uuidv4(),
          };
        });
        treatiseData = _.unionBy(treatiseData, method);
      }
    });
    const groupByTreatise = _.groupBy(treatiseData, 'method');
    const methods = _.orderBy(
      _.uniqBy(treatiseData, 'method').map((data) => {
        return {
          method: data.method,
          count: groupByTreatise[data.method] ? groupByTreatise[data.method].length : 0,
          percent: groupByTreatise[data.method]
            ? Number(((groupByTreatise[data.method].length / treatiseData.length) * 100).toFixed(2))
            : null,
        };
      }),
      'method',
      'asc'
    );
    return ResultData.ok({
      data: { methods: methods },
    });
  }
}
