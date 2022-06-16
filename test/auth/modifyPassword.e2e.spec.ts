import { AppModule } from '@/app.module';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { createUser, CreateUserRetType } from '../testUtils';
describe('test/auth/modifyPassword.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let module: TestingModule;

  // mock arguments
  const mobile = '13012345678';
  const newPassword = '12345678';
  const oldPassword = '123456789';
  let userRet: CreateUserRetType;
  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    app = module.createNestApplication();

    await app.init();
    // 构造测试数据
    userRet = await createUser({ mobile, password: oldPassword }, authService, module);
  });
  test('should not POST /auth/modifyPassword before login', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/modifyPassword')
      .send({ mobile, oldPassword, newPassword });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /auth/modifyPassword with incorrect oldPassword', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/modifyPassword')
      .set('Authorization', userRet.headers.authorization)
      .send({ mobile, oldPassword: 'error password', newPassword });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10009);
  });
  test('should not POST /auth/modifyPassword with identical passwords', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/modifyPassword')
      .set('Authorization', userRet.headers.authorization)
      .send({ mobile, oldPassword, newPassword: oldPassword });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10008);
  });
  test('should POST /auth/modifyPassword and signIn with newPassword', async () => {
    // make request:modifyPassword
    const result = await request(app.getHttpServer())
      .post('/auth/modifyPassword')
      .set('Authorization', userRet.headers.authorization)
      .send({ mobile, oldPassword, newPassword });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    // make request:signIn
    const loginResult = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({ mobile, password: newPassword, provider: '' });
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
    if (app) {
      await app.close();
    }
  });
});
