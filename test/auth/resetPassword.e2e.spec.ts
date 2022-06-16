import { AppModule } from '@/app.module';
import { Codes } from '@/entities/Codes';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { createUser, CreateUserRetType } from '../testUtils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
describe('test/auth/resetPassword.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let module: TestingModule;
  let codesRepository;
  // mock arguments
  const mobile = '13012345678';
  const password = '12345678';
  const code = '123456';
  let userRet: CreateUserRetType;
  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    codesRepository = module.get<Repository<Codes>>(getRepositoryToken(Codes));
    app = module.createNestApplication();

    await app.init();
    // 构造测试数据
    userRet = await createUser({ mobile, password }, authService, module);
    // 发送验证码
    await codesRepository.save({
      mobile: mobile,
      code: code,
    });
  });
  test('should not POST /auth/resetPassword without sending code', async () => {
    //delete code
    await codesRepository.delete({ mobile });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/resetPassword')
      .send({ mobile, code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10004);
  });
  test('should not POST /auth/resetPassword with wrong code', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/resetPassword')
      .send({ mobile, code: 'error code', password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10006);
  });
  test('should not POST /auth/resetPassword with expired code', async () => {
    //update code
    await codesRepository.update(mobile, {
      sentAt: new Date(new Date().getTime() - 60000),
    });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/resetPassword')
      .send({ mobile, code: 'error code', password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10005);
  });
  test('should not POST /auth/resetPassword with user not sign up', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/resetPassword')
      .send({ mobile: '13012345670', code: code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10013);
  });
  test('should POST /auth/resetPassword and signIn with newPassword', async () => {
    // make request:resetPassword
    const result = await request(app.getHttpServer())
      .post('/auth/resetPassword')
      .send({ mobile, password, code });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    // make request:signIn
    const loginResult = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({ mobile, password, provider: '' });
    // use expect by jest
    expect(loginResult.status).toBe(HttpStatus.OK);
    expect(loginResult.body.code).toBe(200);
    expect(loginResult.body.message).toBe('ok');
    expect(loginResult.body.data.mobile).toBe(mobile);
    expect(loginResult.body.data.type).toBeTruthy();
  });
  afterEach(async () => {
    // delete user
    await userRet.finalize();
    //delete code
    await codesRepository.delete({ mobile });
    if (app) {
      await app.close();
    }
  });
});
