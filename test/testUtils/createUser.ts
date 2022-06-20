import { Gender_Types_Enum } from '@/common/enums/common.enum';
import { bhash } from '@/common/utils';
import { Logins } from '@/entities/Logins';
import { Users } from '@/entities/Users';
import { AuthService } from '@/modules/auth/auth.service';
import faker from '@faker-js/faker';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

type ParamsType = {
  mobile: string;
  password?: string;
};

export type CreateUserRetType = {
  user: Users;
  login: Logins;
  token: string;
  headers: { authorization: string; 'Content-Type': 'application/json' };
  finalize: () => void;
};

export const createUser = async (
  { mobile, password = '12345678'}: ParamsType,
  authService: AuthService,
  module: TestingModule
): Promise<CreateUserRetType> => {
  const usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  const loginsRepository = module.get<Repository<Logins>>(getRepositoryToken(Logins));
  // arguments
  const hashedPassword = bhash(password);
  // delete before delete
  await usersRepository.delete({ mobile });
  await loginsRepository.delete({ mobile });
  // create user
  const userInfo = usersRepository.create({
    mobile,
    gender: Gender_Types_Enum.Unknown,
    name: faker.name.findName().slice(0, 19),
    info: {},
  } as unknown as Partial<Users>);
  const user = await usersRepository.save(userInfo);
  // create login
  const login = await loginsRepository.save({
    mobile,
    token: hashedPassword,
    provider: 'local',
  });
  const token = authService.createToken(instanceToPlain(user));
  return {
    user,
    login,
    token,
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    finalize: async () => {
      await usersRepository.delete({ mobile });
      await loginsRepository.delete({ mobile });
    },
  };
};
