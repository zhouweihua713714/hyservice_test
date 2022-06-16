import { Exercise_Types_Enum, Paper_Types_Enum } from '@/common/enums/common.enum';
import { UserExerciseDetails } from '@/entities/UserExerciseDetails';
import { UserExercises } from '@/entities/UserExercises';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type ParamsType = {
  payloads: {
    userAnswerId?: string;
    answerId?: string;
    isCorrect?: number;
    userId: string;
    questionId: string;
    wrongType?: string;
    nodeId?: string;
    recommendNodeId?: string;
    exerciseId?: string;
    isPrompt?: number;
    type?: string;
    testId?: string;
    endedAt?: Date;
    answerImages?: [string];
    paperType?: string;
    score?: number;
    testRemainingTime?: number;
    isFinishedSelfEvaluation?: boolean;
    questionTime?: number;
    recommendNodeIds?: [string];
  }[];
  module: TestingModule;
};

export type CreateUserExerciseDetailsRetType = {
  user_exercise_details: UserExerciseDetails[];
  userExercise: UserExercises;
  finalize: () => void;
};

export const createUserExerciseDetails = async ({
  payloads,
  module,
}: ParamsType): Promise<CreateUserExerciseDetailsRetType> => {
  const userExerciseDetailsRepository = module.get<Repository<UserExerciseDetails>>(
    getRepositoryToken(UserExerciseDetails)
  );
  const userExercisesRepository = module.get<Repository<UserExercises>>(
    getRepositoryToken(UserExercises)
  );
  // create user exercise
  const userExercise = await userExercisesRepository.save({
    user: {
      id: payloads[0].userId,
    },
    startedAt: new Date(),
    node: {
      id: payloads[0].nodeId ? payloads[0].nodeId : null,
    },
    test: {
      id: payloads[0].testId ? payloads[0].testId : null,
    },
    paperType: Paper_Types_Enum.MathOne,
    type: {
      enumId: payloads[0].type ? payloads[0].type : Exercise_Types_Enum.DailyExercise,
    },
    endedAt: payloads[0].endedAt ? payloads[0].endedAt : null,
    testRemainingTime: payloads[0].testRemainingTime ? payloads[0].testRemainingTime : 0,
    isFinishedSelfEvaluation: payloads[0].isFinishedSelfEvaluation
      ? payloads[0].isFinishedSelfEvaluation
      : undefined,
    recommendNodeIds: payloads[0].recommendNodeIds ? payloads[0].recommendNodeIds : null,
    exerciseReport:
      payloads[0].type && payloads[0].type === Exercise_Types_Enum.DiagnosticExercise
        ? {
            nodes: [],
            defeat_rate: '0.0',
            node_number: 3,
            accuracy_rate: '100.0',
            question_time: 67,
            diagnosticNodes: [
              {
                id: 'section_000054',
                name: '概率、条件概率和概率的基本公式',
                is_leaf: 1,
                percent: '96.6',
                parent_id: 'chapter_000015',
                sequence_number: 2,
              },
              {
                id: 'section_000055',
                name: '事件的独立性和独立重复试验',
                is_leaf: 1,
                percent: '96.6',
                parent_id: 'chapter_000015',
                sequence_number: 3,
              },
              {
                id: 'section_000053',
                name: '事件、样本空间、事件间的关系与运算',
                is_leaf: 1,
                percent: '99.7',
                parent_id: 'chapter_000015',
                sequence_number: 1,
              },
              {
                id: 'chapter_000015',
                name: '随机事件与概率',
                is_leaf: 0,
                percent: null,
                parent_id: 'probability_theory',
                sequence_number: 1,
              },
            ],
            question_number: 2,
            correct_question_number: 2,
            average_correct_question_number: 2,
          }
        : {
            nodes: [
              {
                id: 'section_000047',
                name: '解空间',
                after_percent: '0.0',
                before_percent: '15.0',
              },
              {
                id: 'section_000012',
                name: '定积分的应用',
                after_percent: '0.0',
                before_percent: '15.0',
              },
            ],
            defeat_rate: '0.0',
            node_number: 2,
            accuracy_rate: '0.0',
            question_time: 7,
            diagnosticNodes: [],
            question_number: 5,
            correct_question_number: 0,
            average_correct_question_number: 0,
          },
  } as unknown as Partial<UserExercises>);
  // arguments
  const userExerciseDetailData = payloads.map((payload) => {
    return {
      user: {
        id: payload.userId,
      },
      question: {
        id: payload.questionId,
      },
      userAnswerId: payload.userAnswerId ? payload.userAnswerId : undefined,
      answerId: payload.answerId ? payload.answerId : undefined,
      isCorrect: payload.isCorrect ? payload.isCorrect : 0,
      isPrompt: payload.isPrompt ? payload.isPrompt : 0,
      startedAt: new Date(),
      endedAt: new Date(),
      questionTime: payload.questionTime ? payload.questionTime : 60,
      type: {
        enumId: payload.type ? payload.type : Exercise_Types_Enum.DailyExercise,
      },
      wrongType: payload.wrongType ? payload.wrongType : null,
      reason: '测试数据理由',
      exercise: { id: payload.exerciseId ? payload.exerciseId : userExercise.id },
      recommendNodeId: payload.recommendNodeId ? payload.recommendNodeId : undefined,
      answerImages: payload.answerImages ? payload.answerImages : undefined,
      score: payload.score || payload.score === 0 ? payload.score : null,
    } as unknown as Partial<UserExerciseDetails>;
  });
  // create user exercise details
  const user_exercise_details = await userExerciseDetailsRepository.save(userExerciseDetailData);

  return {
    user_exercise_details,
    userExercise,
    finalize: async () => {
      await userExerciseDetailsRepository.delete(
        user_exercise_details.map((user_exercise_detail) => {
          return user_exercise_detail.id;
        })
      );
    },
  };
};
