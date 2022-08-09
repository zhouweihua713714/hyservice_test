import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { TermTypes } from '@/entities/TermTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let subjects: Subjects[];
let termType: TermTypes;
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  subjects: Subjects[];
  termType: TermTypes;
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
    subjects = await tester.subjectsRepository.save([
      { id: `S${genCodeOfLength(8)}`, name: '学科名称', type: Content_Types_Enum.TERM },
      { id: `S${genCodeOfLength(8)}`, name: '学科名称1', type: Content_Types_Enum.PATENT },
    ]);
    termType = await tester.termTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '项目类型名称',
    });
    return { user, normalUser, columns, subjects, termType };
  },
  down: async (tester) => {
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
