import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import {
  Content_Status_Enum,
  Education_Level_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { constant } from '@/common/utils/constant';
import { Policies } from '@/entities/Policies.entity';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let policyType: PolicyTypes;
let policies: Policies[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  policies: Policies[];
  policyType: PolicyTypes;
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
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: 'column_04', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_04', sequenceNumber: 1 },
    ]);
    policyType = await tester.policyTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '政策类型名称',
    });
    policies = await tester.policiesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
        name: '政策1',
        keyword: '关键字;政策标题匹配',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        name: '政策2  无type关键字匹配',
        keyword: '无关键词:政策标题匹配',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        name: '政策3 无type关键字匹配',
        keyword: '关键字;政策',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        columnId: columns[1].id,
        name: '政策4 无type关键字匹配',
        keyword: '关键字;无type关键字匹配',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 10000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
        name: '政策5 type匹配',
        keyword: '---',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 9000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
        name: '政策6 type匹配',
        keyword: '-----',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 8000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
        name: '政策7 type匹配',
        keyword: '-----',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 7000).toString(),
        columnId: columns[1].id,
        name: '政策8 无条件',
        keyword: '-----',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 6000).toString(),
        columnId: columns[1].id,
        name: '政策9 无条件',
        keyword: '-----',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 5000).toString(),
        columnId: columns[1].id,
        name: '政策10 无条件',
        keyword: '----',
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 4000).toString(),
        columnId: columns[1].id,
        name: '政策11 无条件',
        keyword: '----',
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    return { user, normalUser, policies, policyType, columns };
  },
  down: async (tester) => {
    await tester.policiesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
