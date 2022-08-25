import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { PatentValidTypes } from '@/entities/PatentValidTypes.entity';
import { PatentTypes } from '@/entities/PatentTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let patentValidType: PatentValidTypes;
let patentType: PatentTypes;
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  patentValidType: PatentValidTypes;
  patentType: PatentTypes;
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
    patentValidType = await tester.patentValidTypesRepository.save(
      { id: `P${genCodeOfLength(8)}`, name: '专利有效性'},
    );
    patentType = await tester.patentTypesRepository.save({
      id: `P${genCodeOfLength(8)}`,
      name: '专利类型名称',
    });
    return { user, normalUser, columns, patentValidType, patentType };
  },
  down: async (tester) => {
    await tester.usersRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.patentValidTypesRepository.delete({});
    await tester.patentTypesRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
