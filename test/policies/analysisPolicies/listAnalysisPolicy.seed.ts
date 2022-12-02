import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { AnalysisPolicies } from '@/entities/AnalysisPolicies.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let analysisPolicies: AnalysisPolicies[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  analysisPolicies: AnalysisPolicies[];
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
    analysisPolicies = await tester.analysisPoliciesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        title: '政策解读标题',
        source: '文章来源',
        announcedAt: new Date(),
        url: 'http://baidu.com',
        content: '正文',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        title: '政策解读标题',
        source: '文章来源',
        announcedAt: new Date(),
        url: 'http://baidu.com',
        content: '正文',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        title: '政策解读标题',
        source: '文章来源',
        announcedAt: new Date(),
        url: 'http://baidu.com',
        content: '正文',
        ownerId: user.user.id,
        updatedAt: new Date(new Date().getTime() - 50000),
      },
    ]);
    return { user, normalUser, analysisPolicies, columns };
  },
  down: async (tester) => {
    await tester.analysisPoliciesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
