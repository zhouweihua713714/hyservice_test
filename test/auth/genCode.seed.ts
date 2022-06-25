import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';

import { samples } from '../samples';

const { mobile, password } = samples;

export const seed: TesterSeed = {
  down: async (tester) => {
    await tester.codesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
