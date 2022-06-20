import { AppModule } from '@/app.module';
import { User_Status_Enum } from '@/common/enums/common.enum';
import { Users } from '@/entities/Users';
// import { AuthModule } from '@/modules/auth/auth.module';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createUser,
  CreateUserRetType,
  genMobile,
} from '../testUtils';

describe('test/auth/signIn.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let module: TestingModule;
  let userRet: CreateUserRetType;
  let usersRepository;
  // mock arguments
  const mobile = genMobile();
  const password = '12345678';
  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    app = module.createNestApplication();
    await app.init();
    // 构造测试数据
    userRet = await createUser({ mobile, password }, authService, module);
  });
  test('should not POST /auth/signIn if mobile not found', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({ mobile: '13900000001', password: 'error password' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10014);
  });
  test('should not POST /auth/signIn with incorrect password', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({ mobile, password: 'error password' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10014);
  });
  test('should POST /auth/signIn by correct mobile and password', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({ mobile, password });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.mobile).toBe(mobile);
  });
  test('should not POST /auth/signIn if account is disabled', async () => {
    // update user
    await usersRepository.update(userRet.user.id, {
      status:  User_Status_Enum.Disabled,
    });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({ mobile, password });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10012);
  });
  afterEach(async () => {
    // delete user
    await userRet.finalize();
    if (app) {
      await app.close();
    }
  });
});
