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
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: 'column_07', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_07', sequenceNumber: 1 },
    ]);
    fields = await tester.fieldsRepository.save([
      {
        id: `f${genCodeOfLength(8)}`,
        name: '主领域',
        type: Content_Types_Enum.CONFERENCE,
        isMain: 1,
      },
      {
        id: `fn${genCodeOfLength(8)}`,
        name: '子领域',
        type: Content_Types_Enum.CONFERENCE,
        isMain: 0,
      },
      {
        id: `fn${genCodeOfLength(8)}`,
        name: '子领域2',
        type: Content_Types_Enum.CONFERENCE,
        isMain: 0,
      },
      {
        id: `f${genCodeOfLength(8)}`,
        name: '主领域2',
        type: Content_Types_Enum.CONFERENCE,
        isMain: 1,
      },
      {
        id: `f${genCodeOfLength(8)}`,
        name: '主领域3',
        type: Content_Types_Enum.CONFERENCE,
        isMain: 1,
      },
    ]);
    institutions = await tester.institutionsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构1本身排除',
        columnId: columns[1].id,
        field: [fields[0].id, fields[3].id, fields[4].id],
        minorField: [fields[1].id, fields[2].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构2',
        columnId: columns[1].id,
        field: [fields[4].id],
        minorField: [fields[1].id, fields[2].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构3',
        columnId: columns[1].id,
        field: [fields[0].id],
        minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构4',
        columnId: columns[1].id,
        field: [fields[0].id, fields[3].id],
        minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 10000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构5',
        columnId: columns[1].id,
        // field: [fields[0].id],
        minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: new Date().getTime().toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构6',
        columnId: columns[1].id,
        // field: [fields[0].id],
        minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 5000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构7',
        columnId: columns[1].id,
        // field: [fields[0].id],
        minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 4000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构8',
        columnId: columns[1].id,
        // field: [fields[0].id],
        // minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 3000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构9',
        columnId: columns[1].id,
        // field: [fields[0].id],
        // minorField: [fields[1].id],
        website: 'http://baidu.com',
        ownerId: user.user.id,
      },
      {
        id: (new Date().getTime() - 2000).toString(),
        status: Content_Status_Enum.ACTIVE,
        name: '机构10',
        columnId: columns[1].id,
        // field: [fields[0].id],
        // minorField: [fields[1].id],
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
