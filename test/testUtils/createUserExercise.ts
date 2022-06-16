import { Exercise_Types_Enum } from '@/common/enums/common.enum';
import { UserExercises } from '@/entities/UserExercises';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type ParamsType = {
  userId: string;
  endedAt?: Date;
  startedAt?: Date;
  nodeId: string;
  paperType: string;
  type?: string;
  testId?: string;
};

export type CreateUserExerciseRetType = {
  userExercise: UserExercises;
  finalize: () => void;
};

export const createUserExercise = async (
  {
    userId,
    startedAt = new Date(),
    endedAt,
    nodeId,
    paperType = 'math_one',
    type = Exercise_Types_Enum.DailyExercise,
    testId,
  }: ParamsType,
  module: TestingModule
): Promise<CreateUserExerciseRetType> => {
  const userExercisesRepository = module.get<Repository<UserExercises>>(
    getRepositoryToken(UserExercises)
  );

  // delete before create
  await userExercisesRepository.delete({
    user: {
      id: userId,
    },
  });
  // create user exercise
  const userExerciseInfo = userExercisesRepository.create({
    user: {
      id: userId,
    },
    nodeId,
    startedAt,
    endedAt,
    question_time: 60,
    paperType,
    type: type,
    test: {
      id: testId ? testId : null,
    },
  } as unknown as Partial<UserExercises>);
  const userExercise = await userExercisesRepository.save(userExerciseInfo);
  return {
    userExercise,
    finalize: async () => {
      await userExercisesRepository.delete({ id: userExercise.id });
    },
  };
};
