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
      { id: `S${genCodeOfLength(8)}`, name: '学科名称', type: Content_Types_Enum.TERM },
      { id: `S${genCodeOfLength(8)}`, name: '学科名称1', type: Content_Types_Enum.PATENT },
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
        subject: subjects[0].id,
        name: '项目名称1',
        province: '350000',
        unit: '依托单位',
        principal: '项目负责人',
        termNumber: 'YH35000111',
        keyword: '项目;关键词;其他',
        money: 22,
        department: '教育学部',
        subjectNo: 'XK0001',
        ownerId: user.user.id,
        authorizedAt: new Date(),
        updatedAt: new Date(new Date().getTime() - 60000),
        startedAt: new Date(new Date().getTime() - 60000),
        endedAt: new Date(),
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        type: termType.id,
        subject: subjects[0].id,
        name: '项目名称2',
        province: '350000',
        unit: '依托单位',
        principal: '项目负责人',
        termNumber: 'YH35000111',
        keyword: '项目;关键词;其他',
        money: 22,
        department: '教育学部',
        subjectNo: 'XK0001',
        ownerId: user.user.id,
        authorizedAt: new Date(),
        startedAt: new Date(new Date().getTime() - 60000),
        endedAt: new Date(),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        type: termType.id,
        subject: subjects[0].id,
        name: '项目名称3',
        province: '350000',
        unit: '依托单位',
        principal: '项目负责人',
        termNumber: 'YH35000111',
        keyword: '项目;关键词;其他',
        money: 22,
        department: '教育学部',
        subjectNo: 'XK0001',
        ownerId: user.user.id,
        authorizedAt: new Date(),
        startedAt: new Date(new Date().getTime() - 60000),
        endedAt: new Date(),
        updatedAt: new Date(new Date().getTime() - 50000),
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        type: termType.id,
        subject: subjects[0].id,
        name: '项目名称4',
        province: '350000',
        unit: '依托单位',
        principal: '项目负责人',
        termNumber: 'YH35000111',
        keyword: '项目;关键词;其他',
        money: 22,
        department: '教育学部',
        subjectNo: 'XK0001',
        ownerId: user.user.id,
        authorizedAt: new Date(),
        updatedAt: new Date(new Date().getTime() - 60000),
        startedAt: new Date(new Date().getTime() - 60000),
        endedAt: new Date(),
      },
    ]);
    return { user, normalUser, terms, columns };
  },
  down: async (tester) => {
    await tester.termsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
