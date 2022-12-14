import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { ResearchReports } from '@/entities/ResearchReports.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let reports: ResearchReports[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  reports: ResearchReports[]
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
    reports = await tester.researchReportsRepository.save([{
      id: (new Date().getTime() - 50000).toString(),
      columnId: columns[0].id,
      title: '报告',
      author: 'test',
      abstract: 'test',
      downloads: 1,
      url: '',
      status: Content_Status_Enum.ACTIVE,
      publishedAt: new Date()
    }]);
    return { user, normalUser, columns, reports };
  },
  down: async (tester) => {
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.researchReportsRepository.delete({});
  },
};
