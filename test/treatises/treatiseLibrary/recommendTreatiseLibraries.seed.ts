import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import { Content_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { TreatiseLibrary } from '@/entities/TreatiseLibrary.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let treatiseLibraries: TreatiseLibrary[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  treatiseLibraries: TreatiseLibrary[];
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
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: 'column_08', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_08', sequenceNumber: 1 },
    ]);
    const sorts = await tester.treatiseLibraryTypesRepository.save([
      {
        id: `C${genCodeOfLength(8)}`,
        name: '分类名称',
        columnId: columns[1].id,
      },
      {
        id: `C${genCodeOfLength(8)}`,
        name: '分类名称1',
        columnId: columns[1].id,
      },
    ]);
    treatiseLibraries = await tester.treatiseLibraryRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        sort: sorts[0].id,
        title: '精选文库1',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        sort: sorts[0].id,
        title: '精选文库2',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要匹配',
        keyword: '关键1词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 40000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        sort: sorts[0].id,
        title: '精选文库3',
        deliveryAt: new Date(),
        year: 2021,
        abstract: '摘要不限制字数',
        keyword: '关键词匹配',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        sort: sorts[0].id,
        title: '精选文库4',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        columnId: columns[1].id,
        sort: sorts[1].id,
        title: '精选文库5',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 10000).toString(),
        columnId: columns[1].id,
        sort: sorts[1].id,
        title: '精选文库6',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 5000).toString(),
        columnId: columns[1].id,
        sort: sorts[1].id,
        title: '精选文库7',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 4000).toString(),
        columnId: columns[1].id,
        sort: sorts[1].id,
        title: '精选文库8',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 3000).toString(),
        columnId: columns[1].id,
        sort: sorts[1].id,
        title: '精选文库9',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    return { user, normalUser, columns, treatiseLibraries };
  },
  down: async (tester) => {
    await tester.treatiseLibraryRepository.delete({});
    await tester.treatiseLibraryTypesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
