import { AppModule } from '@/app.module';
import { Codes } from '@/entities/Codes';
import { Users } from '@/entities/Users';
// import { AuthModule } from '@/modules/auth/auth.module';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
describe('test/auth/signUp.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let module: TestingModule;
  let codesRepository;
  let usersRepository;
  // mock arguments
  const mobile = '13012345678';
  const password = '12345678';
  const code = '123456';
  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    codesRepository = module.get<Repository<Codes>>(getRepositoryToken(Codes));
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    app = module.createNestApplication();
    await app.init();
    // 构造测试数据
    // 发送验证码
    await codesRepository.save({
      mobile: mobile,
      code: code,
    });
  });
  test('should not POST /auth/signUp without valid information', async () => {
    //delete code
    await codesRepository.delete({ mobile });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({ mobile: 'mobile', code: 'code', password: 'password' });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10003);
  });
  test('should not POST /auth/signUp without sending code', async () => {
    //delete code
    await codesRepository.delete({ mobile: mobile });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({ mobile, code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10004);
  });
  test('should not POST /auth/signUp with expired code', async () => {
    //update code
    await codesRepository.update(mobile, {
      sentAt: new Date(new Date().getTime() - 60000),
    });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({ mobile, code: code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10005);
  });
  test('should not POST /auth/signUp with wrong code', async () => {
    //update code
    await codesRepository.update(mobile, {
      sentAt: new Date(new Date().getTime() - 60000),
    });
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({ mobile, code: '111111', password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10005);
  });
  test('should POST /auth/signUp', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({ mobile, password, code });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.mobile).toBe(mobile);
  });
  afterEach(async () => {
    // delete user
    await usersRepository.delete({ mobile });
    //delete code
    await codesRepository.delete({ mobile });
    if (app) {
      await app.close();
    }
  });
});
