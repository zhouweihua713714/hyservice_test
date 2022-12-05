import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import { User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { TreatiseLibraryTypes } from '@/entities/TreatiseLibraryTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let sorts: TreatiseLibraryTypes[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
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
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_08', sequenceNumber: 1 },
    ]);
    sorts = await tester.treatiseLibraryTypesRepository.save([{
      id: `C${genCodeOfLength(8)}`,
      name: '分类名称',
      columnId: columns[1].id,
    },{
      id: `C${genCodeOfLength(8)}`,
      name: '分类名称',
      columnId: columns[0].id,
    }]);
    return { user, normalUser, columns, sorts };
  },
  down: async (tester) => {
    await tester.treatiseLibraryRepository.delete({});
    await tester.treatiseLibraryTypesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
