import { AppModule } from '@/app.module';
import {
  Exercise_Types_Enum,
  Question_Status_Enum,
  Question_Types_Enum,
  User_Status_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { RedisKeyPrefix } from '@/common/enums/redisKeyPrefix.enum';
import { RedisUtilService } from '@/common/libs/redis/redis.service';
import { getRedisKey } from '@/common/utils';
import { AuthService } from '@/modules/auth/auth.service';
import { FetchUploadTokenDto } from '@/modules/files/files.dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import {
  createNodes,
  CreateNodesRetType,
  createUploadTokenOfCache,
  CreateUploadTokenOfCacheRetType,
  createUser,
  CreateUserRetType,
  genMobile,
} from '../testUtils';
import { createQuestions, CreateQuestionsRetType } from '../testUtils/createQuestions';
import { createQuestionSource, CreateQuestionSourceRetType } from '../testUtils/createSource';

const query: FetchUploadTokenDto = {
  questionId: '需要赋值',
  exerciseType: Exercise_Types_Enum.DailyExercise,
};

// mock arguments
const mobile = genMobile();
const password = '12345678';

describe('test/files/uploadToken.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let redisService: RedisUtilService;
  let config: ConfigService;
  let module: TestingModule;

  // 构造变量
  let userRet: CreateUserRetType;
  let questionsRet: CreateQuestionsRetType;
  let nodesSet: CreateNodesRetType;
  let sourceSet: CreateQuestionSourceRetType;
  let uploadTokenRet: CreateUploadTokenOfCacheRetType;

  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    redisService = module.get<RedisUtilService>(RedisUtilService);
    config = module.get<ConfigService>(ConfigService);
    app = module.createNestApplication();
    await app.init();
    // 构造测试数据
    // create user
    userRet = await createUser({ mobile, password }, authService, module);
    // create nodes
    nodesSet = await createNodes(module);
    // create question source
    sourceSet = await createQuestionSource(module);
    // create questions
    questionsRet = await createQuestions({
      payloads: [
        {
          source: sourceSet.questionSource.enumId,
          type: Question_Types_Enum.Question,
          status: Question_Status_Enum.Active,
          ownerId: userRet.user.id,
          nodeId: nodesSet.nodes[3].id,
        },
      ],
      module,
    });
    query.questionId = questionsRet.questions[0].id;
    uploadTokenRet = await createUploadTokenOfCache(
      userRet.user.id,
      userRet.user.status as unknown as User_Status_Enum,
      userRet.user.type as unknown as User_Types_Enum,
      query.questionId,
      Exercise_Types_Enum.DailyExercise,
      config,
      redisService
    );
  });

  test('should not Get /file/uploadToken before login', async () => {
    // make request
    const result = await request(app.getHttpServer()).get('/file/uploadToken').query(query);
    // use expect by jest
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should Get /file/uploadToken by correct question id and exercise type', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .get('/file/uploadToken')
      .set('Authorization', userRet.headers.authorization)
      .query(query);
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.uploadToken).toBeTruthy();
    // 缓存数据测试
    const uploadToken = await redisService.get(uploadTokenRet.uploadTokenKey);
    // 状态键
    const statusKey = getRedisKey(RedisKeyPrefix.UPLOAD_TOKEN, uploadToken || '');
    // 查询状态
    const cacheData = await redisService.get(statusKey);
    expect(uploadToken).toBeTruthy();
    expect(cacheData).toBeTruthy();
  });

  afterEach(async () => {
    await userRet.finalize();
    await sourceSet.finalize();
    await nodesSet.finalize();
    await questionsRet.finalize();
    await uploadTokenRet.finalize();
    if (app) {
      await app.close();
    }
  });
});
