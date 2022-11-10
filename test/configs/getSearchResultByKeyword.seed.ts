import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { samples } from '../samples';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
export type DataType = {
  user: CreateUserRetType;
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    await tester.keywordsRepository.save([
      { name: '项目', type: Content_Types_Enum.TERM, frequency: 1 },
      { name: '项目关键词1', type: Content_Types_Enum.TERM, frequency: 1 },
    ]);

    return { user, normalUser };
  },
  down: async (tester) => {
    await tester.usersRepository.delete({});
    await tester.keywordsRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
