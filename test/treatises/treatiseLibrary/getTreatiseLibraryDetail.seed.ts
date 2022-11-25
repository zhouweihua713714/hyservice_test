import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import {
  Channels_Enum,
  Content_Types_Enum,
  Labels_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { TreatiseLibrary } from '@/entities/treatiseLibrary.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let treatiseLibraryInfo: TreatiseLibrary;
export type DataType = {
  user: CreateUserRetType;
  treatiseLibraryInfo: TreatiseLibrary;
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
    const sort = await tester.treatiseLibraryTypesRepository.save({
      id: `A${genCodeOfLength(8)}`,
      name: '类型名称',
      columnId: columns[1].id,
    });
    treatiseLibraryInfo = await tester.treatiseLibraryRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      title: '精选文库标题必填',
      field: '教育学',
      minorField: '教育学子领域;教育学子领域2',
      magazineField: '教育学',
      magazineMinorField: '教育学子领域;教育学子领域2',
      url: 'http://baidu.com',
      deliveryAt: new Date(),
      channel: Channels_Enum.WAY_001,
      author: '第一作者',
      authorUnit: '第一作者单位',
      correspondingAuthor: '通讯作者',
      correspondingAuthorUnit: '通讯作者单位',
      correspondingAuthorEmail: '通讯作者邮箱',
      otherAuthor: '其他作者',
      otherAuthorUnit: '其他作者',
      sort: sort.id,
      abstract: '摘要不限制字数',
      keyword: '关键词',
      name: '期刊/会议名',
      ownerId: user.user.id,
    });
   
    return { user, treatiseLibraryInfo };
  },
  down: async (tester) => {
    await tester.treatiseLibraryRepository.delete({});
    await tester.treatiseLibraryTypesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
