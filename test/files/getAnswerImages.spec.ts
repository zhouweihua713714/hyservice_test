import { AppModule } from '@/app.module';
import {
  Exercise_Types_Enum,
  Question_Status_Enum,
  Question_Types_Enum,
  Upload_Status_Enum,
  User_Status_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { RedisUtilService } from '@/common/libs/redis/redis.service';
import { AuthService } from '@/modules/auth/auth.service';
import { FetchAnswerImagesDto } from '@/modules/files/files.dto';
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
const query: FetchAnswerImagesDto = {
  questionId: '需要赋值',
  exerciseType: Exercise_Types_Enum.DailyExercise,
};

// mock arguments
const mobile = genMobile();
const password = '12345678';

describe('test/files/getAnswerImages.e2e.spec.ts', () => {
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
    // 构造数据 生成 uploadToken
    uploadTokenRet = await createUploadTokenOfCache(
      userRet.user.id,
      userRet.user.status as unknown as User_Status_Enum,
      userRet.user.type as unknown as User_Types_Enum,
      questionsRet.questions[0].id,
      Exercise_Types_Enum.DailyExercise,
      config,
      redisService,
      Upload_Status_Enum.Finished,
      ['123.jpg']
    );
  });

  test('should not Get /file/answerImages before login ', async () => {
    // make request
    const result = await request(app.getHttpServer()).get('/file/answerImages').query(query);
    // use expect by jest
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });

  test('should Get /file/answerImages', async () => {
    // make request
    const result = await request(app.getHttpServer())
      .get('/file/answerImages')
      .set('Authorization', userRet.headers.authorization)
      .query(query);
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.answerImages).toBeTruthy();
  });

  afterEach(async () => {
    // 状态键
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
