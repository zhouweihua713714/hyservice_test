import request from 'supertest';
import { AppModule } from '@/app.module';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createFiles, CreateFilesRetType } from '../../testUtils';

// mock arguments
const headers_key_url = 'https://xxxx.ngrok.io/v1/version';
const base64 = (str: string) => Buffer.from(str).toString('base64');

const authorization = 'authorization_test';
describe.skip('test/files/oss/callback.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let config: ConfigService;
  let module: TestingModule;

  // 构造变量
  let filesRet: CreateFilesRetType;

  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    config = module.get<ConfigService>(ConfigService);
    app = module.createNestApplication();
    await app.init();
    // 构造测试数据
    // create files
    filesRet = await createFiles({
      payloads: [{ status: 1 }],
      module,
    });
  });
  test('should not POST /file/callback with field id if have not been launched', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .post('/file/callback')
      .set({
        'Content-Type': 'application/json',
        authorization,
        'x-oss-pub-key-url': base64(headers_key_url),
      })
      .send({
        file_id: '未赋值',
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  test('should not POST /file/callback with field id', async () => {
    // 配置数据
    const ossBucket = config.get<string>('oss.ossBucket');
    // 构造数据
    const body = {
      user_id: 'a',
      file_id: filesRet.files[0].id,
      bucket: ossBucket,
      object: 'a',
      etag: 'a',
      size: '123',
      mimeType: 'text/plain',
      imageInfo: {},
    };
    // make request
    const result = await request(app.getHttpServer())
      .post('/file/callback')
      .set({
        'Content-Type': 'application/json',
        authorization,
        'x-oss-pub-key-url': base64(headers_key_url),
      })
      .send(body);
    // use expect by jest
    expect(result.body).toBeTruthy();
    expect(result.body.file_id).toBeTruthy();
    expect(result.body.imageInfo).toBeTruthy();
    expect(result.body.status).toBeTruthy();
  });

  afterEach(async () => {
    // 状态键
    if (app) {
      await app.close();
    }
  });
});
