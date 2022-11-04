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
        title: '论文匹配',
        deliveryAt: new Date(),
        year: 2022,
        abstract: '摘要不限制字数',
        keyword: '关键词',
        ownerId: user.user.id,
        releasedAt:'2001-06-09',
        topic:'一级主题',
        childTopic:'二级主题',
        goal:'研究目标',
        object:'研究;对象',
        paradigm:'研究范式',
        method:'分析;方法',
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
        releasedAt:new Date(),
        topic:'一级主题',
        childTopic:'二级主题',
        goal:'研究目标',
        object:'研究;对象1',
        paradigm:'研究范式',
        method:'分析;方法',
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
        releasedAt:'2001-06-09',
        topic:'一级主题',
        childTopic:'二级主题',
        goal:'研究目标',
        object:'研究;对象1',
        paradigm:'研究范式',
        method:'分析;方法',
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
        keyword: '关键;Aa',
        ownerId: user.user.id,
        releasedAt:'2001-06-09',
        topic:'一级主题',
        childTopic:'二级主题',
        goal:'研究目标',
        object:'研究;对象1',
        paradigm:'研究范式',
        method:'分析;方法',
        status: Content_Status_Enum.ACTIVE,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
    ]);
    // user favorites
    await tester.userFavoriteTreatisesRepository.save(
      treatises.map((data) => {
        return {
          userId: user.user.id,
          treatise: {
            id: data.id,
          },
        };
      })
    );
    // user label treatises
    await tester.userLabelTreatisesRepository.save([
      ...treatises.map((data) => {
        return {
          userId: user.user.id,
          treatise: {
            id: data.id,
          },
          label: Labels_Enum.Label_001,
        };
      }),
      {
        userId: '233',
        treatise: {
          id: treatises[0].id,
        },
        label: Labels_Enum.Label_001,
      },
      {
        userId: '234',
        treatise: {
          id: treatises[0].id,
        },
        label: Labels_Enum.Label_002,
      },
    ]);
    return { user, normalUser, columns, treatises };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.userFavoriteTreatisesRepository.delete({});
    await tester.userLabelTreatisesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.languagesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
