import { Logins } from '@/entities/Logins.entity';
import { Users } from '@/entities/Users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { bhash } from '@/common/utils';
import { Gender_Types_Enum } from '@/common/enums/common.enum';
import faker from '@faker-js/faker';
import { AuthService } from '@/modules/auth/auth.service';
import { instanceToPlain } from 'class-transformer';
type ParamsType = {
  mobile: string;
  password?: string;
};

export type CreateUserRetType = {
  user: Users;
  login: Logins;
  token: string;
  headers: { authorization: string; 'Content-Type': 'application/json' };
};
@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Logins)
    private loginsRepository: Repository<Logins>
  ) {}

  // 创建用户
  async createUser(  { mobile, password = '12345678'}: ParamsType, authService: AuthService): Promise<CreateUserRetType> {
     // arguments
  const hashedPassword = bhash(password);
  // delete before delete
  await this.usersRepository.delete({ mobile });
  await this.loginsRepository.delete({ mobile });
  // create user
  const userInfo = this.usersRepository.create({
    mobile,
    gender: Gender_Types_Enum.Unknown,
    name: faker.name.findName().slice(0, 19),
    info: {},
  } as unknown as Partial<Users>);
  const user = await this.usersRepository.save(userInfo);
  // create login
  const login = await this.loginsRepository.save({
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
  };
  }
  //
}
