import _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import {
  americaTermKeywordsRepository,
  americaTermsRepository,
  keywordsRepository,
  policiesRepository,
  termKeywordsRepository,
  termsRepository,
  treatiseKeywordsRepository,
  treatiseLibraryKeywordsRepository,
  treatiseLibraryRepository,
  treatisesRepository,
} from '../repository/repository';
import { Content_Status_Enum, Content_Types_Enum } from '@/common/enums/common.enum';
import { IsNull, Not } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  /**
   * @description 获取文章类型
   * @param {} params
   * @returns {ResultData} 返回getArticleTypes信息
   */
  @Cron('0 15 01 * * *')
  async allKeywordTask() {
    this.logger.debug('目前凌晨跑一次,频率根据需求调整');
    // 目前只有项目、论文 后续需要什么再继续跟进任务
    console.time('查询时间');
    //先查出最新的实体数据内容
    const [treatises, terms, americaTerms, policies, treatiseLibraries] = await Promise.all([
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
      americaTermsRepository.find({
        where: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
          keyword: Not(IsNull()),
        },
        select: ['keyword', 'awardNumber', 'columnId', 'title'],
      }),
      policiesRepository.find({
        where: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
          keyword: Not(IsNull()),
        },
        select: ['keyword'],
      }),
      treatiseLibraryRepository.find({
        where: {
          status: Content_Status_Enum.ACTIVE,
          deletedAt: IsNull(),
          enabled: true,
          keyword: Not(IsNull()),
        },
        select: ['keyword', 'id', 'title', 'columnId'],
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
      }[] = [],
      americaTermsKeywords: {
        awardNumber: string;
        name: string;
        columnId: string;
        title: string;
      }[] = [],
      policiesKeywords: { id: string; name: string; frequency: number }[] = [],
      treatiseLibraryKeywords: {
        id: string;
        name: string;
        columnId: string;
        title: string;
        treatiseId: string;
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
    // 美国项目
    for (let i = 0; i < americaTerms.length; i++) {
      if (americaTerms[i].keyword) {
        const keyword = americaTerms[i].keyword
          ?.replace(/\+/g, '')
          .split(';')
          .map((data) => {
            return {
              awardNumber: americaTerms[i].awardNumber,
              name: data.toLowerCase().trim(),
              columnId: americaTerms[i].columnId,
              title: americaTerms[i].title,
            };
          });
        americaTermsKeywords = _.unionBy(
          americaTermsKeywords,
          keyword,
          (o) => o.awardNumber + o.name
        );
      }
    }
    // 政策
    for (let i = 0; i < policies.length; i++) {
      if (policies[i].keyword) {
        const keyword = policies[i].keyword
          ?.replace(/\+/g, '')
          .split(';')
          .map((data) => {
            return {
              id: uuidv4(),
              name: data.toLowerCase().trim(),
              frequency: 0,
              type: Content_Types_Enum.POLICY,
            };
          });
        policiesKeywords = _.unionBy(policiesKeywords, keyword, 'id');
      }
    }
    // 精选文库
    for (let i = 0; i < treatiseLibraries.length; i++) {
      if (treatiseLibraries[i].keyword) {
        const keyword = treatiseLibraries[i].keyword
          ?.replace(/\+/g, '')
          .split(';')
          .map((data) => {
            return {
              id: uuidv4(),
              name: data.toLowerCase().trim(),
              columnId: treatiseLibraries[i].columnId,
              title: treatiseLibraries[i].title,
              treatiseId: treatiseLibraries[i].id,
            };
          });
        treatiseLibraryKeywords = _.unionBy(treatiseLibraryKeywords, keyword, 'id');
      }
    }
    console.timeEnd('数据准备时间');
    console.time('插入执行时间');
    //插入之前每次清空表,防止产生一些无效数据,insert 这里逐条插入是因为批量插入会有最大限制且当前论文数据量大批量插入需要分组所以直接单条插入更方便
    await Promise.all([
      treatiseKeywordsRepository.delete({}),
      termKeywordsRepository.delete({}),
      americaTermKeywordsRepository.delete({}),
      treatiseLibraryKeywordsRepository.delete({}),
    ]);
    let treatiseCount,
      termCount,
      americaTermCount,
      treatiseLibraryCount = 0;
    //论文
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
    // 美国数据
    for (let i = 0; i < americaTermsKeywords.length; i++) {
      if (americaTermsKeywords[i].name.replace(/\+/g, '')) {
        await americaTermKeywordsRepository.save(americaTermsKeywords[i]);
        americaTermCount++;
      }
    }
    //精选文库
    for (let i = 0; i < treatiseLibraryKeywords.length; i++) {
      if (treatiseLibraryKeywords[i].name.replace(/\+/g, '')) {
        await treatiseLibraryKeywordsRepository.save(treatiseLibraryKeywords[i]);
        treatiseLibraryCount++;
      }
    }
    console.timeEnd('插入执行时间');
    // 更新keywords数据准备
    console.time('更新keywords数据准备');
    const groupByTermKeywords = _.groupBy(termKeywords, 'name');
    const groupByAmericaTermKeywords = _.groupBy(americaTermsKeywords, 'name');
    const groupByTreatiseKeywords = _.groupBy(treatiseKeywords, 'name');
    const groupByPolicyKeywords = _.groupBy(policiesKeywords, 'name');
    const groupByTreatiseLibraryKeywords = _.groupBy(treatiseLibraryKeywords, 'name');
    //项目
    const termKeywordData =
      _.uniqBy(termKeywords, 'name').map((data) => {
        return {
          name: data.name,
          type: Content_Types_Enum.TERM,
          frequency: groupByTermKeywords[data.name].length,
        };
      }) || [];
    // 美国项目
    _.uniqBy(americaTermsKeywords, 'name').map((data) => {
      const index = _.findIndex(termKeywordData, { name: data.name });
      if (index > -1) {
        const oldData = termKeywordData[index];
        const length = groupByAmericaTermKeywords[data.name].length || 0;
        termKeywordData[index] = {
          name: data.name,
          type: Content_Types_Enum.TERM,
          frequency: oldData.frequency + length,
        };
      } else {
        termKeywordData.push({
          name: data.name,
          type: Content_Types_Enum.TERM,
          frequency: groupByAmericaTermKeywords[data.name].length,
        });
      }
    });
    //论文
    const treatiseKeywordData = _.uniqBy(treatiseKeywords, 'name').map((data) => {
      return {
        name: data.name,
        type: Content_Types_Enum.TREATISE,
        frequency: groupByTreatiseKeywords[data.name].length,
      };
    });
    //政策
    const policyKeywordData = _.uniqBy(
      policiesKeywords.map((data) => {
        return {
          name: data.name,
          frequency: groupByPolicyKeywords[data.name].length,
          type: Content_Types_Enum.POLICY,
        };
      }),
      'name'
    );
    //精选文库
    const treatiseLibraryKeywordData = _.uniqBy(
      treatiseLibraryKeywords.map((data) => {
        return {
          name: data.name,
          frequency: groupByTreatiseLibraryKeywords[data.name].length,
          type: Content_Types_Enum.TREATISE_LIBRARY,
        };
      }),
      'name'
    );
    // for (let i = 0; i < policyKeywords.length; i++) {
    //   await keywordsRepository.save(policyKeywords[i]);
    // }
    console.timeEnd('更新keywords数据准备');
    console.time('keywords插入执行时间');
    let treatiseKeywordCount,
      termKeywordCount,
      policyKeywordCount,
      treatiseLibraryKeywordCount = 0;
    //先将keywords得frequency 更新为0 再全量更新keywords(目前脚本涉及哪些就更新哪些)
    await Promise.all([
      keywordsRepository
        .createQueryBuilder()
        .update({ frequency: 0 })
        .where({ type: Content_Types_Enum.TERM })
        .execute(),
      keywordsRepository
        .createQueryBuilder()
        .update({ frequency: 0 })
        .where({ type: Content_Types_Enum.TREATISE })
        .execute(),
      keywordsRepository
        .createQueryBuilder()
        .update({ frequency: 0 })
        .where({ type: Content_Types_Enum.POLICY })
        .execute(),
      keywordsRepository
        .createQueryBuilder()
        .update({ frequency: 0 })
        .where({ type: Content_Types_Enum.TREATISE_LIBRARY })
        .execute(),
    ]);
    //论文
    for (let i = 0; i < termKeywordData.length; i++) {
      if (termKeywordData[i].name.replace(/\+/g, '')) {
        await keywordsRepository.save(termKeywordData[i]);
        treatiseKeywordCount++;
      }
    }
    //项目
    for (let i = 0; i < treatiseKeywordData.length; i++) {
      if (treatiseKeywordData[i].name.replace(/\+/g, '')) {
        await keywordsRepository.save(treatiseKeywordData[i]);
        termKeywordCount++;
      }
    }
    //政策
    for (let i = 0; i < policyKeywordData.length; i++) {
      if (policyKeywordData[i].name.replace(/\+/g, '')) {
        await keywordsRepository.save(policyKeywordData[i]);
        policyKeywordCount++;
      }
    }
    //精选文库
    for (let i = 0; i < treatiseLibraryKeywordData.length; i++) {
      if (treatiseLibraryKeywordData[i].name.replace(/\+/g, '')) {
        await keywordsRepository.save(treatiseLibraryKeywordData[i]);
        treatiseLibraryKeywordCount++;
      }
    }
    console.timeEnd('keywords插入执行时间');
    this.logger.debug(
      '本次执行结果:',
      ' 论文treatiseKeywords长度:',
      treatiseKeywords.length,
      ' 论文treatiseKeywords插入长度:',
      treatiseCount,
      ' 项目termKeywords长度:',
      termKeywords.length,
      ' 项目termKeywords插入长度:',
      termCount,
      ' 美国项目americaTermsKeywords长度:',
      americaTermsKeywords.length,
      ' 美国项目americaTermsKeywords插入长度:',
      americaTermCount,
      ' 论文Keywords长度:',
      treatiseKeywordData.length,
      ' 论文Keywords插入/更新长度:',
      treatiseKeywordCount,
      ' 项目Keywords长度:',
      termKeywordData.length,
      ' 项目Keywords插入/更新长度:',
      termKeywordCount,
      ' 政策Keywords长度:',
      policyKeywordData.length,
      ' 政策Keywords插入/更新长度:',
      policyKeywordCount,
      ' 精选文库treatiseLibraryKeywords长度:',
      treatiseLibraryKeywords.length,
      ' 精选文库treatiseLibraryKeywords插入长度:',
      treatiseLibraryCount,
      ' 精选文库Keywords长度:',
      treatiseKeywordData.length,
      ' 精选文库Keywords插入/更新长度:',
      treatiseLibraryKeywordCount
    );
  }
}
