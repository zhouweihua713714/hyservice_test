import { Gender_Types_Enum } from '@/common/enums/common.enum';
import { Users } from '@/entities/Users.entity';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { bhash } from '@/common/utils';
import _ from 'lodash';
import { Logins } from '@/entities/Logins.entity';
import { AuthService } from '@/modules/auth/auth.service';
import { instanceToPlain } from 'class-transformer';
type ParamsType = {
  types: string[];
  module: TestingModule;
  authService: AuthService;
};

export type CreateUsersRetType = {
  users: {
    id: string;
    authorization: string;
  }[];
};

export const createUsers = async ({
  types,
  module,
  authService,
}: ParamsType): Promise<CreateUsersRetType> => {
  const usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  const loginsRepository = module.get<Repository<Logins>>(getRepositoryToken(Logins));
  const password = '12345678';
  // arguments
  const hashedPassword = bhash(password);
  // get user data
  const userData = types.map((type) => {
    return {
      mobile: faker.phone.phoneNumberFormat().replace(/-/g, ''),
      name: faker.name.findName().slice(0, 19),
      password: password,
      info: {},
      gender: Gender_Types_Enum.Unknown,
    };
  });
  // delete before delete
  await usersRepository.delete({
    mobile: In(
      userData.map((payload) => {
        return payload.mobile;
      })
    ),
  });
  await loginsRepository.delete({
    mobile: In(
      userData.map((payload) => {
        return payload.mobile;
      })
    ),
  });

  // create users
  const users = await usersRepository.save(userData);
  // create logins
  await loginsRepository.save(
    userData.map((user) => {
      return {
        mobile: user.mobile,
        token: hashedPassword,
        provider: 'local',
      };
    })
  );
  const userResults = users.map((user) => {
    return {
      id: user.id,
      authorization: `Bearer ${authService.createToken(instanceToPlain(user))}`,
    };
  });
  return {
    users: userResults
  };
};
