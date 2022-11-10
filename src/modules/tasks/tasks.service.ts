import _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import {
  termKeywordsRepository,
  termsRepository,
  treatiseKeywordsRepository,
  treatisesRepository,
} from '../repository/repository';
import { Content_Status_Enum } from '@/common/enums/common.enum';
import { IsNull, Not } from 'typeorm';
import { Cron, } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  /**
   * @description 获取文章类型
   * @param {} params
   * @returns {ResultData} 返回getArticleTypes信息
   */
  @Cron('0 11 15 * * *')
  async allKeywordTask() {
    this.logger.debug('目前凌晨跑一次,频率根据需求调整');
    // 目前只有项目、论文 后续需要什么再继续跟进任务
    console.time('查询时间');
    //先查出最新的实体数据内容
    const [treatises, terms] = await Promise.all([
      treatisesRepository.find({
        where: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
          keyword: Not(IsNull()),
        },
        select: ['keyword', 'id', 'title', 'columnId'],
      }),
      termsRepository.find({
        where: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
          keyword: Not(IsNull()),
        },
        select: ['keyword', 'id', 'columnId', 'name'],
      }),
    ]);
    console.timeEnd('查询时间');
    console.time('数据准备时间');
    //预插入到treatiseKeywords、termKeywords的数组
    let treatiseKeywords: {
        id: string;
        name: string;
        columnId: string;
        title: string;
        treatiseId: string;
      }[] = [],
      termKeywords: {
        id: string;
        name: string;
        columnId: string;
        termId: string;
      }[] = [];
    //论文
    for (let i = 0; i < treatises.length; i++) {
      if (treatises[i].keyword) {
        const keyword = treatises[i].keyword
          ?.replace(/\+/g, '')
          .split(';')
          .map((data) => {
            return {
              id: uuidv4(),
              name: data.toLowerCase().trim(),
              columnId: treatises[i].columnId,
              title: treatises[i].title,
              treatiseId: treatises[i].id,
            };
          });
        treatiseKeywords = _.unionBy(treatiseKeywords, keyword, 'id');
      }
    }
    // 项目
    for (let i = 0; i < terms.length; i++) {
      if (terms[i].keyword) {
        const keyword = terms[i].keyword
          ?.replace(/\+/g, '')
          .split(';')
          .map((data) => {
            return {
              id: uuidv4(),
              name: data.toLowerCase().trim(),
              columnId: terms[i].columnId,
              termId: terms[i].id,
              title: terms[i].name,
            };
          });
        termKeywords = _.unionBy(termKeywords, keyword, 'id');
      }
    }
    console.timeEnd('数据准备时间');
    console.time('插入执行时间');
    //插入之前每次清空表,防止产生一些无效数据,insert 这里逐条插入是因为批量插入会有最大限制且当前论文数据量大批量插入需要分组所以直接单条插入更方便
    await Promise.all([treatiseKeywordsRepository.delete({}), termKeywordsRepository.delete({})]);
    //论文
    let treatiseCount = 0,
      termCount = 0;
    for (let i = 0; i < treatiseKeywords.length; i++) {
      if (treatiseKeywords[i].name.replace(/\+/g, '')) {
        await treatiseKeywordsRepository.save(treatiseKeywords[i]);
        treatiseCount++;
      }
    }
    //项目
    for (let i = 0; i < termKeywords.length; i++) {
      if (termKeywords[i].name.replace(/\+/g, '')) {
        await termKeywordsRepository.save(termKeywords[i]);
        termCount++;
      }
    }
    console.timeEnd('插入执行时间');
    this.logger.debug(
      '本次执行结果:',
      ' 论文treatiseKeywords长度:',
      treatiseKeywords.length,
      ' 论文treatiseKeywords插入长度:',
      treatiseCount,
      ' 项目termKeywords长度:',
      termKeywords.length,
      ' 项目termKeywords插入长度:',
      termCount
    );
    // 还需要更新keywords
  }
}
