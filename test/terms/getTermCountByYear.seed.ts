import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { TermTypes } from '@/entities/TermTypes.entity';
import { Terms } from '@/entities/Terms.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let subjects: Subjects[];
let termType: TermTypes;
let terms: Terms[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  terms: Terms[];
  termType: TermTypes;
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
    termType = await tester.termTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '项目类型名称',
    });
    terms = await tester.termsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        type: termType.id,
        name: '项目1',
        unit: '依托单位1',
        year: 2022,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        type: termType.id,
        name: '项目2',
        unit: '依托单位2',
        year: 2022,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        name: '项目3',
        unit: '依托单位1',
        year: 2022,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        columnId: columns[1].id,
        name: '项目4',
        unit: '依托单位1',
        year: 2021,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 10000).toString(),
        columnId: columns[1].id,
        name: '项目5',
        unit: '依托单位1',
        year: 2021,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 9000).toString(),
        columnId: columns[1].id,
        name: '项目6',
        unit: '依托单位1',
        year: 2021,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 8000).toString(),
        columnId: columns[1].id,
        name: '项目7',
        unit: '依托单位3',
        year: 2021,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 7000).toString(),
        columnId: columns[1].id,
        name: '项目8',
        unit: '依托单位3',
        year: 2020,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 6000).toString(),
        columnId: columns[1].id,
        name: '项目9',
        unit: '依托单位3',
        year: 2019,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        type: termType.id,
        name: '项目10',
        unit: '依托单位1',
        year: 2018,
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    return { user, normalUser, terms, termType };
  },
  down: async (tester) => {
    await tester.termsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
