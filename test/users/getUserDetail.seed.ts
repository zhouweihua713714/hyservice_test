import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { samples } from '../samples';

const { mobile, password } = samples;

let user: CreateUserRetType;

export type DataType = { user: CreateUserRetType };

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    // user = await createUser({mobile, password}, tester.authService, tester.module);
    user = await tester.usersDao.createUser({ mobile, password }, tester.authService);
    const universityInfo = await tester.universitiesRepository.save({
      id: new Date().getTime().toString(),
      name: '大学名称',
    });
    // update user info
    await tester.usersRepository.save({
      id: user.user.id,
      avatar: '用户头像',
      university: universityInfo.id,
    });
    return { user };
  },
  down: async (tester) => {
    await tester.universitiesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
