import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import { Content_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { TreatiseLibrary } from '@/entities/TreatiseLibrary.entity';
import { TreatiseLibraryTypes } from '@/entities/TreatiseLibraryTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let treatiseLibraries: TreatiseLibrary[];
let sorts: TreatiseLibraryTypes[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  treatiseLibraries: TreatiseLibrary[];
  sorts: TreatiseLibraryTypes[];
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
    sorts = await tester.treatiseLibraryTypesRepository.save([
      {
        id: `C${genCodeOfLength(8)}`,
        name: '分类名称',
        columnId: columns[1].id,
      },
      {
        id: `C${genCodeOfLength(7)}`,
        name: '分类名称1',
        columnId: columns[1].id,
      },
    ]);
    treatiseLibraries = await tester.treatiseLibraryRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        title: '论文匹配',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        sort: sorts[0].id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        title: '论文名称必填',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要匹配',
        keyword: '关键词;AA',
        ownerId: user.user.id,
        sort: sorts[0].id,
        publishedAt: new Date(new Date().getTime() - 40000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        title: '论文名称必填',
        deliveryAt: new Date(),
        year: 2021,
        abstract: '摘要不限制字数',
        keyword: '关键词匹配;aa',
        ownerId: user.user.id,
        sort: sorts[0].id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        title: '论文名称必填',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键;Aa',
        ownerId: user.user.id,
        sort: sorts[1].id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
    ]);
    return { user, normalUser, columns, treatiseLibraries, sorts };
  },
  down: async (tester) => {
    await tester.treatiseLibraryRepository.delete({});
    await tester.treatiseLibraryTypesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
