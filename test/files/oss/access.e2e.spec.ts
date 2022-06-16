import request from 'supertest';
import { AppModule } from '@/app.module';
import { AuthService } from '@/modules/auth/auth.service';
import { AccessDto } from '@/modules/files/oss/oss.dto';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  createFiles,
  CreateFilesRetType,
  createUser,
  CreateUserRetType,
  genMobile,
} from '../../testUtils';

const query: AccessDto = {
  file_id: '需要赋值',
};
// mock arguments
const mobile = genMobile();
const password = '12345678';
describe('test/files/oss/access.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let config: ConfigService;
  let module: TestingModule;

  // 构造变量
  let userRet: CreateUserRetType;
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
    // create user
    userRet = await createUser({ mobile, password }, authService, module);
    // create files
    filesRet = await createFiles({
      payloads: [{ status: 1 }],
      module,
    });
    query.file_id = filesRet.files[0].id;
  });
  test('should GET /file/access with field id', async () => {
    // 获取配置数据
    const ossBucket = config.get<string>('oss.ossBucket');
    const ossRegion = config.get<string>('oss.ossRegion');
    // make request
    const result = await request(app.getHttpServer()).get('/file/access').query(query);
    // use expect by jest
    expect(result.redirect).toBe(true);
    expect(result.statusCode).toBe(302);
    expect(
      result.text.includes(`http://${ossBucket}.${ossRegion}.aliyuncs.com/${query.file_id}`)
    ).toBe(true);
  });

  afterEach(async () => {
    // 状态键
    await userRet.finalize();
    await filesRet.finalize();
    if (app) {
      await app.close();
    }
  });
});
