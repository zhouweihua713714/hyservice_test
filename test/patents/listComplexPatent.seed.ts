import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { PatentTypes } from '@/entities/PatentTypes.entity';
import { Patents } from '@/entities/Patents.entity';
import { PatentValidTypes } from '@/entities/PatentValidTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let patentValidType: PatentValidTypes;
let patentType: PatentTypes;
let patents: Patents[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  patents: Patents[];
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
    patentValidType = await tester.patentValidTypesRepository.save({
      id: `P${genCodeOfLength(8)}`,
      name: '专利有效性',
    });
    patentType = await tester.patentTypesRepository.save({
      id: `P${genCodeOfLength(8)}`,
      name: '专利类型名称',
    });
    patents = await tester.patentsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        type: patentType.id,
        title: '标题匹配',
        abstract: '摘要',
        applicant: '申请人',
        announcedNo: '公开号',
        announcedAt: new Date(),
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        type: patentType.id,
        title: '专利标题名称必填',
        abstract: '摘要匹配',
        status: Content_Status_Enum.ACTIVE,
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        type: patentType.id,
        title: '专利标题名称必填',
        abstract: '摘要111匹配1111',
        applicant: '申请人',
        status: Content_Status_Enum.ACTIVE,
        ownerId: user.user.id,
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        // type: patentType.id,
        title: '专利标题名称必填',
        abstract: '摘要',
        applicant: '申请人',
        announcedNo: '公开号',
        ownerId: user.user.id,
        keyword: '关键字匹配',
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    return { user, normalUser, columns, patents };
  },
  down: async (tester) => {
    await tester.patentsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.patentValidTypesRepository.delete({});
    await tester.patentTypesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
