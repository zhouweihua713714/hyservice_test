import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { PeriodicalPeriods } from '@/entities/PeriodicalPeriods.entity';
import { Languages } from '@/entities/Languages.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let subjects: Subjects[];
let periodicalPeriod: PeriodicalPeriods;
let language: Languages;
let periodicals: Periodicals[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  periodicals: Periodicals[];
  columns: Columns[];
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    normalUser = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.User },
      tester.authService
    );
    columns = await tester.columnsRepository.save([
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: '0', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: '1', sequenceNumber: 1 },
    ]);
    subjects = await tester.subjectsRepository.save([
      { id: `S${genCodeOfLength(8)}`, name: '学科名称', type: Content_Types_Enum.PERIODICAL },
      { id: `S${genCodeOfLength(8)}`, name: '学科名称1', type: Content_Types_Enum.PERIODICAL },
    ]);
    language = await tester.languagesRepository.save({
      id: `L${genCodeOfLength(8)}`,
      name: '语种名称',
      type: `${Content_Types_Enum.PERIODICAL}_${Content_Types_Enum.PERIODICAL}`,
    });
    periodicalPeriod = await tester.periodicalPeriodsRepository.save({
      id: `P${genCodeOfLength(8)}`,
      name: '发刊周期名称',
    });
    periodicals = await tester.periodicalsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        subject: [subjects[0].id, subjects[1].id],
        name: '期刊名称',
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(),
        establishedAt: new Date(),
        articleNumber: 1000,
        ownerId: user.user.id,
        language: [language.id],
        citeScore: 80.1,
        citeRate: 82,
        field: '教育学',
        minorField: '教育学子领域;教育学子领域2',
        ISSN: '20220816-8-25',
        manager: '主管单位',
        organizer: '主办单位',
        quote: 12000,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        subject: [subjects[0].id],
        name: '名称',
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(),
        establishedAt: new Date(),
        articleNumber: 1001,
        ownerId: user.user.id,
        language: [language.id],
        citeScore: 80.1,
        citeRate: 82,
        field: '教育学',
        minorField: '教育学子领域;教育学子领域2',
        ISSN: '20220816-8-25',
        manager: '主管单位',
        organizer: '主办单位',
        quote: 12000,
        compositeImpactFactor:1.55
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        subject: [subjects[0].id],
        name: '期刊名称',
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(),
        establishedAt: new Date(),
        articleNumber: 1002,
        ownerId: user.user.id,
        language: [language.id],
        citeScore: 80.1,
        citeRate: 82,
        field: '教育学',
        minorField: '教育学子领域;教育学子领域2',
        ISSN: '20220816-8-25',
        manager: '主管单位',
        organizer: '主办单位',
        quote: 12000,
      },
    ]);

    return { user, normalUser, periodicals, columns };
  },
  down: async (tester) => {
    await tester.periodicalsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.languagesRepository.delete({});
    await tester.periodicalPeriodsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
