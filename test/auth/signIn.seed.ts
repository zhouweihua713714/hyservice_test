import { TesterSeed } from '../testHelper';
import {  CreateUserRetType } from '@/dao/users.dao';
import {samples} from '../samples';

const {mobile, password} = samples;

let user: CreateUserRetType;

export type DataType = {user: CreateUserRetType};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    // user = await createUser({mobile, password}, tester.authService, tester.module);
    user = await tester.usersDao.createUser({mobile, password},tester.authService);
    return {user};
  },
  down: async (tester) => {
    await tester.usersRepository.delete(user.user.id);
  }
};
