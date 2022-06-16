import { AppModule } from '@/app.module';
import { Codes } from '@/entities/Codes';
// import { AuthModule } from '@/modules/auth/auth.module';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
describe('test/auth/signup.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let module: TestingModule;
  let codesRepository;
  // mock arguments
  const mobile = '18050324007';

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
  });
  test('should POST /auth/genCode', async () => {
    // make request
    const result = await request(app.getHttpServer()).post('/auth/genCode').send({ mobile });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.mobile).toBe(mobile);
  });

  afterEach(async () => {
    //delete code
    await codesRepository.delete({ mobile });
    if (app) {
      await app.close();
    }
  });
});
