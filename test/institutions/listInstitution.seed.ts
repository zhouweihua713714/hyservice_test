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
import { Fields } from '@/entities/Fields.entity';
import { Institutions } from '@/entities/Institutions.entity';

const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let fields: Fields[];
let institutions: Institutions[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  institutions: Institutions[];
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
    fields = await tester.fieldsRepository.save([
      {
        id: `f${genCodeOfLength(8)}`,
        name: '主领域',
        type: Content_Types_Enum.INSTITUTION,
        isMain: 1,
      },
      {
        id: `fn${genCodeOfLength(8)}`,
        name: '子领域',
        type: Content_Types_Enum.INSTITUTION,
        isMain: 0,
      },
    ]);
    institutions = await tester.institutionsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        name: '机构名称必填',
        columnId: columns[1].id,
        foreignName: 'China',
        address: '详细地址',
        introduction: '简介',
        unit: '主办单位',
        field: [fields[0].id],
        minorField: [fields[1].id],
        longitude: 114.35683,
        latitude: 30.506257,
        url: '图片链接',
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        name: '机构名称必填',
        columnId: columns[1].id,
        foreignName: 'China',
        address: '详细地址',
        introduction: '简介',
        unit: '主办单位',
        field: [fields[0].id],
        minorField: [fields[1].id],
        longitude: 114.35683,
        latitude: 30.506257,
        url: '图片链接',
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: new Date().getTime().toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构名称必填',
        columnId: columns[1].id,
        foreignName: 'China',
        address: '详细地址',
        introduction: '简介',
        unit: '主办单位',
        field: [fields[0].id],
        minorField: [fields[1].id],
        longitude: 114.35683,
        latitude: 30.506257,
        url: '图片链接',
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
    ]);
    return { user, normalUser, columns, institutions };
  },
  down: async (tester) => {
    await tester.institutionsRepository.delete({});
    await tester.fieldsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
