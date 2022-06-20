import request from 'supertest';
import { AppModule } from '@/app.module';
import { AuthService } from '@/modules/auth/auth.service';
import { LaunchDto } from '@/modules/files/oss/oss.dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createUser, CreateUserRetType, genMobile } from '../../testUtils';
import { encode } from '@/common/utils';
import { Files } from '@/entities/Files';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const body: LaunchDto = {
  filename: '123.jpg',
  uploadToken: '',
};
// mock arguments
const mobile = genMobile();
const password = '12345678';
describe('test/files/oss/launch.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let config: ConfigService;
  let module: TestingModule;
  // 构造变量
  let userRet: CreateUserRetType;
  let filesRepository;
  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    config = module.get<ConfigService>(ConfigService);
    filesRepository = module.get<Repository<Files>>(getRepositoryToken(Files));
    app = module.createNestApplication();
    await app.init();
    // 构造测试数据
    // create user
    userRet = await createUser({ mobile, password }, authService, module);
  });

  test('should not POST /file/launch before login ', async () => {
    // make request
    const result = await request(app.getHttpServer()).post('/file/launch').send(body);
    // use expect by jest
    expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should POST /file/launch after signUp', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/file/launch/')
      .set('Authorization', userRet.headers.authorization)
      .send(body);
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
  });

  test('should POST /file/launch with uploadToken', async () => {
    const uploadToken = encode(
      JSON.stringify({
        id: userRet.user.id,
        status: userRet.user.status,
        timestamp: Date.now(),
      }),
      config.get<string>('encode.secretKey') || '',
      config.get<string>('encode.iv') || ''
    );
    // make request
    const result = await request(app.getHttpServer()).post('/file/launch').send({
      filename: body.filename,
      uploadToken,
    });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
  });

  afterEach(async () => {
    // delete user
    await filesRepository.delete({ filename: body.filename });
    // 状态键
    await userRet.finalize();
    if (app) {
      await app.close();
    }
  });
});
