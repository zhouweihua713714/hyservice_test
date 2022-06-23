import { TesterSeed } from '../../testHelper';
import faker from '@faker-js/faker';
import { CreateUserRetType } from '@/dao/users.dao';
import { v4 as uuidv4 } from 'uuid';
import { samples } from '../../samples';
import { Files } from '@/entities/Files.entity';

const { mobile, password } = samples;
let user: CreateUserRetType;
let file: Files;
export type DataType = { user: CreateUserRetType; file: Files };

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    // user = await createUser({mobile, password}, tester.authService, tester.module);
    user = await tester.usersDao.createUser({ mobile, password }, tester.authService);
    file = await tester.filesRepository.save({
      id: uuidv4(),
      filename: faker.name.findName().slice(0, 19),
      status: 1,
    });
    return { user, file };
  },
  down: async (tester) => {
    await tester.usersRepository.delete(user.user.id);
    await tester.filesRepository.delete(file.id);
  },
};
