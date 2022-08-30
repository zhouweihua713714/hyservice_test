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
import { Conferences } from '@/entities/Conferences.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let fields: Fields[];
let conferenceInfo: Conferences;
export type DataType = {
  user: CreateUserRetType;
  conferenceInfo: Conferences;
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
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
        type: Content_Types_Enum.CONFERENCE,
        isMain: 1,
      },
      {
        id: `fn${genCodeOfLength(8)}`,
        name: '子领域',
        type: Content_Types_Enum.CONFERENCE,
        isMain: 0,
      },
    ]);
    conferenceInfo = await tester.conferencesRepository.save({
      id: '有传id则为编辑无则新增',
      status: Content_Status_Enum.ACTIVE,
      name: '会议名称必填',
      columnId: columns[1].id,
      abbreviation: '会议缩写',
      conductedAt: new Date(),
      endedAt: new Date(),
      period: 1,
      location: '中国',
      introduction: '简介',
      coverUrl: '封面链接',
      field: [fields[0].id],
      minorField: [fields[1].id],
      website: 'http://baidu.com',
      contact: '联络人',
      email: '邮箱',
      unit: '举办单位',
      deliveryEndedAt: new Date(),
      preregisterEndedAt: new Date(),
      registerEndedAt: new Date(),
      ownerId:user.user.id
    });
    return { user, conferenceInfo };
  },
  down: async (tester) => {
    await tester.conferencesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
