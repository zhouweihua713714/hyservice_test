import _ from 'lodash';
import { ResultData } from '@/common/utils/result';

import { SignInResInfo } from '../auth/auth.types';
import { ErrorCode } from '@/common/utils/errorCode';
import {
  articleTypesRepository,
  columnsRepository,
  languagesRepository,
  treatisesRepository,
  usersRepository,
} from '../repository/repository';
import {
  GetTreatiseDetailDto,
  ListTreatiseDto,
  OperateTreatisesDto,
  RemoveTreatisesDto,
  SaveTreatiseDto,
} from './treatises.dto';
import {
  Channels_Enum,
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { In, IsNull, Like } from 'typeorm';

export class TreatisesService {
  /**
   * @description 获取论文详情
   * @param {GetTreatiseDetailDto} params
   * @returns {ResultData} 返回getTreatiseDetail信息
   */
  async getTreatiseDetail(params: GetTreatiseDetailDto): Promise<ResultData> {
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
      articleTypeInfo = await articleTypesRepository.findOneBy({
        id: treatiseInfo.sort,
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
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
      sortName: articleTypeInfo ? articleTypeInfo.name : null,
      owner: userInfo ? userInfo.mobile : null,
      ...treatiseInfo,
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
      const articleTypeInfo = await articleTypesRepository.findOneBy({
        id: sort,
        type: Like(`%${Content_Types_Enum.TREATISE}%`),
      });
      if (!articleTypeInfo) {
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
}
