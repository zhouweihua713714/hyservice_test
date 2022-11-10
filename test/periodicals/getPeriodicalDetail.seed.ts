import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { Languages } from '@/entities/Languages.entity';
import { PeriodicalPeriods } from '@/entities/PeriodicalPeriods.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let subjects: Subjects[];
let periodicalInfo: Periodicals;
let periodicalPeriod: PeriodicalPeriods;
let language: Languages;
export type DataType = {
  user: CreateUserRetType;
  periodicalInfo: Periodicals;
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    columns = await tester.columnsRepository.save([
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: '0', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: '1', sequenceNumber: 1 },
    ]);
    subjects = await tester.subjectsRepository.save([
      { id: `S${genCodeOfLength(8)}`, name: '学科名称', type: Content_Types_Enum.PERIODICAL },
      { id: `S${genCodeOfLength(8)}`, name: '学科名称1', type: Content_Types_Enum.PATENT },
    ]);
    language = await tester.languagesRepository.save({
      id: `L${genCodeOfLength(8)}`,
      name: '语种名称',
      type: `${Content_Types_Enum.PERIODICAL}_${Content_Types_Enum.PATENT}`,
    });
    periodicalPeriod = await tester.periodicalPeriodsRepository.save({
      id: `P${genCodeOfLength(8)}`,
      name: '发刊周期名称',
    });
    periodicalInfo = await tester.periodicalsRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      subject: [subjects[0].id],
      name: '期刊名称',
      type: 'periodical',
      introduction: '简介300字',
      language: [language.id],
      region: '中国,美国',
      field: '教育学',
      minorField: '教育学子领域;教育学子领域2',
      url: 'http://baidu.com',
      address: '这里是地址',
      search: '引用情况',
      impactFactor: 3.564,
      establishedAt: new Date(),
      publisher: '出版商',
      period: periodicalPeriod.id,
      manager: '主管单位',
      organizer: '主办单位',
      ISSN: '20220816-8-25',
      CN: '国内统一刊号',
      pekingUnit: ['journals_001', 'journals_002'],
      honor: '期刊荣誉',
      articleNumber: 1000,
      quote: 12000,
      downloads: 1000,
      compositeImpactFactor: 6.789,
      checkPeriod: '审稿周期',
      releasePeriod: '发稿周期',
      recordRate: 88.8,
      checkFee: 1520.12,
      pageFee: 1521.14,
      reward: 112.56,
      coverUrl: '封面链接',
      citeScore: 80.1,
      citeRate: 82,
      ownerId: user.user.id
    });
    return { user, periodicalInfo };
  },
  down: async (tester) => {
    await tester.periodicalsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.languagesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
