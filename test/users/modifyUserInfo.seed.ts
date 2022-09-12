import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { samples } from '../samples';
import { Universities } from '@/entities/Universities.entity';

const { mobile, password } = samples;

let user: CreateUserRetType;
let universityInfo: Universities;
export type DataType = { user: CreateUserRetType; universityInfo: Universities };

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    // user = await createUser({mobile, password}, tester.authService, tester.module);
    user = await tester.usersDao.createUser({ mobile, password }, tester.authService);
    universityInfo = await tester.universitiesRepository.save({
      id: new Date().getTime().toString(),
      name: '大学名称',
    });
    return { user, universityInfo };
  },
  down: async (tester) => {
    await tester.universitiesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
