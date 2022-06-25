import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';

import { samples } from '../samples';

const { mobile, password, code } = samples;
let user: CreateUserRetType;

export type DataType = { user: CreateUserRetType };

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser({ mobile, password }, tester.authService);
    await tester.codesRepository.save({ mobile: mobile, code: code });
    return { user };
  },
  down: async (tester) => {
    await tester.codesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
