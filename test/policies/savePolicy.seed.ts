import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
import { TopicTypes } from '@/entities/TopicTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let policyType: PolicyTypes;
let topicType: TopicTypes;
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  policyType: PolicyTypes;
  topicType: TopicTypes;
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
    policyType = await tester.policyTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '政策类型名称',
    });
    topicType = await tester.topicTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '政策类型名称',
    });
    return { user, normalUser, columns, policyType, topicType };
  },
  down: async (tester) => {
    await tester.usersRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.policyTypesRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
