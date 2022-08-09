import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';

import { samples } from '../samples';
import { User_Types_Enum } from '@/common/enums/common.enum';

const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;

export type DataType = { user: CreateUserRetType; normalUser: CreateUserRetType };

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
    return { user, normalUser };
  },
  down: async (tester) => {
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
