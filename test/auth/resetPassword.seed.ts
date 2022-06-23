import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';

import { samples } from '../samples';

const { mobile, password, code } = samples;
let user: CreateUserRetType;

export type DataType = { user: CreateUserRetType };

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    // create user
    user = await tester.usersDao.createUser({ mobile, password }, tester.authService);
    // create code
    await tester.codesRepository.save({ mobile: mobile, code: code });
    return { user };
  },
  down: async (tester) => {
    await tester.usersRepository.delete(user.user.id);
    await tester.codesRepository.delete({ mobile });
  },
};
