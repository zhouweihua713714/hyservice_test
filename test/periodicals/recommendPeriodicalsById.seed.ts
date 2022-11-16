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
import { Languages } from '@/entities/Languages.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
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
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: 'column_03', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_03', sequenceNumber: 1 },
    ]);
    periodicals = await tester.periodicalsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        name: '期刊1',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
        field: '教育学;教育学1;教育学2',
        minorField: '教育学子领域;教育学子领域2',
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        name: '期刊2 大领域',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
        field: '教育学',
        minorField: '教育学子领域;教育学子领域2',
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        name: '期刊3 大领域',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
        field: '教育学1',
        minorField: '教育学子领域;教育学子领域2',
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        columnId: columns[1].id,
        name: '期刊4 大领域',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
        field: '教育学2',
        minorField: '教育学子领域;教育学子领域2',
      },
      {
        id: (new Date().getTime() - 10000).toString(),
        columnId: columns[1].id,
        name: '期刊5 小领域',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
        field: '教育4',
        minorField: '教育学子领域',
      },
      {
        id: (new Date().getTime() - 9000).toString(),
        columnId: columns[1].id,
        name: '期刊6 小领域',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
        field: '教育4',
        minorField: '教育学子领域2',
      },
      {
        id: (new Date().getTime() - 8000).toString(),
        columnId: columns[1].id,
        name: '期刊7 随机',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 7000).toString(),
        columnId: columns[1].id,
        name: '期刊8 随机',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,

      },
      {
        id: (new Date().getTime() - 6000).toString(),
        columnId: columns[1].id,
        name: '期刊9 随机',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 5000).toString(),
        columnId: columns[1].id,
        name: '期刊10 随机',
        type: 'periodical',
        status: Content_Status_Enum.ACTIVE,
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
