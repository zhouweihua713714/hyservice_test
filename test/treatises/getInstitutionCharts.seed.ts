import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Status_Enum, Labels_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Treatises } from '@/entities/Treatises.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let treatises: Treatises[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  treatises: Treatises[];
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
    treatises = await tester.treatisesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        title: '论文1',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        // authorUnit:'xx大学',
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        title: '论文2',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要匹配',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 40000),
        status: Content_Status_Enum.ACTIVE,
        authorUnit:'xxx大学',
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        title: '论文3',
        deliveryAt: new Date(),
        year: 2021,
        abstract: '摘要不限制字数',
        keyword: '关键词匹配',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
        authorUnit:'xx大学',
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        title: '论文4',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
        authorUnit:'xxxxx大学',
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        columnId: columns[1].id,
        title: '论文5',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
        authorUnit:'xxxx大学',
      },
      {
        id: (new Date().getTime() - 10000).toString(),
        columnId: columns[1].id,
        title: '论文6',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
        authorUnit:'xxxx大学',
      },
      {
        id: (new Date().getTime() - 5000).toString(),
        columnId: columns[1].id,
        title: '论文7',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
        authorUnit:'xxxx大学',
      },
      {
        id: (new Date().getTime() - 4000).toString(),
        columnId: columns[1].id,
        title: '论文8',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
        authorUnit:'xxxx大学',
      },
      {
        id: (new Date().getTime() - 3000).toString(),
        columnId: columns[1].id,
        title: '论文9',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
        authorUnit:'xxxx大学',
      },
    ]);
    return { user, normalUser, columns, treatises };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.languagesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
