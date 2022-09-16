import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import {
  Channels_Enum,
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { Languages } from '@/entities/Languages.entity';
import { ArticleTypes } from '@/entities/ArticleTypes.entity';
import { Treatises } from '@/entities/Treatises.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let subjects: Subjects[];
let treatises: Treatises[];
let articleType: ArticleTypes;
let language: Languages;
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
        title: '论文匹配',
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
        title: '论文名称必填',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要匹配',
        keyword: '关键词',
        ownerId: user.user.id,
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
        keyword: '关键词匹配',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[0].id,
        title: '论文名称必填',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键',
        ownerId: user.user.id,
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
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
