import { AppModule } from '@/app.module';
import {
  Exercise_Types_Enum,
  Paper_Types_Enum,
  Question_Status_Enum,
  Question_Types_Enum,
  Test_Types_Enum,
} from '@/common/enums/common.enum';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import {
  createUser,
  CreateUserRetType,
  CreateNodesRetType,
  createNodes,
  createUserPaperType,
  createUserExerciseDetails,
  CreateUserExerciseDetailsRetType,
  CreateQuestionsRetType,
  CreateQuestionSourceRetType,
  createQuestionSource,
  createQuestions,
  CreateTestsRetType,
  CreateUserPaperRetType,
  CreateUserCourseRetType,
  createUserCourse,
  createTests,
} from '../testUtils';
import { v4 as uuidv4 } from 'uuid';
describe('test/users/getUserInfo.e2e.spec.ts', () => {
  // 引入全局变量
  let app: INestApplication;
  let authService: AuthService;
  let module: TestingModule;
  // mock arguments
  const mobile = '13012345678';
  const password = '123456';
  let nodeId = 'advanced_mathematics';
  let userRet: CreateUserRetType;
  let questionsRet: CreateQuestionsRetType;
  let nodesSet: CreateNodesRetType;
  let sourceSet: CreateQuestionSourceRetType;
  let userExerciseDetailsRet: CreateUserExerciseDetailsRetType;
  let userPaperTypeSet: CreateUserPaperRetType;
  let userCourseSet: CreateUserCourseRetType;
  beforeEach(async () => {
    // 初始化全局变量
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    app = module.createNestApplication();

    await app.init();
    // 构造测试数据
    userRet = await createUser({ mobile, password }, authService, module);
    // create nodes
    nodesSet = await createNodes(module);
    // create user paper type
    userPaperTypeSet = await createUserPaperType(
      {
        userId: userRet.user.id,
        paperType: Paper_Types_Enum.MathOne,
      },
      module
    );
    // create user course
    userCourseSet = await createUserCourse(
      {
        userId: userRet.user.id,
        courseId: nodesSet.nodes[0].id,
      },
      module
    );
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
    // create user exercise details next
    userExerciseDetailsRet = await createUserExerciseDetails({
      payloads: [
        {
          isCorrect: 1,
          userId: userRet.user.id,
          questionId: questionsRet.questions[0].id,
          answerId: questionsRet.questions[0]?.answers
            ? questionsRet.questions[0]?.answers[0].id
            : undefined,
          nodeId: nodesSet.nodes[2].id,
          type: Exercise_Types_Enum.DailyExercise,
        },
      ],
      module,
    });
    nodeId = nodesSet.nodes[0].id;
  });
  test('should not GET /users/getUserInfo before login', async () => {
    // make request
    const result = await request(app.getHttpServer()).get('/users/getUserInfo').query({ nodeId });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should GET /users/getUserInfo', async () => {
    // current user paper type: math_one,then update user paper type: math_two
    // make request
    const result = await request(app.getHttpServer())
      .get('/users/getUserInfo')
      .set('Authorization', userRet.headers.authorization)
      .query({ nodeId });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.exerciseId).toBe(userExerciseDetailsRet.userExercise.id);
    expect(result.body.data.courseId).toBe(nodesSet.nodes[0].id);
    expect(result.body.data.paperType).toBe(Paper_Types_Enum.MathOne);
  });
  test('should GET /users/getUserInfo all is unset', async () => {
    // delete all info
    await userCourseSet.finalize();
    await userPaperTypeSet.finalize();
    await userExerciseDetailsRet.finalize();
    // make request
    const result = await request(app.getHttpServer())
      .get('/users/getUserInfo')
      .set('Authorization', userRet.headers.authorization)
      .query({ nodeId });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.exerciseId).toBe(null);
    expect(result.body.data.courseId).toBe(null);
    expect(result.body.data.paperType).toBe(null);
  });
  afterEach(async () => {
    // delete user
    await userRet.finalize();
    await nodesSet.finalize();
    await sourceSet.finalize();
    await userCourseSet.finalize();
    if (app) {
      await app.close();
    }
  });
});
