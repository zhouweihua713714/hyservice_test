import faker from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { In, Repository } from 'typeorm';
import { UserWrongQuestions } from '@/entities/UserWrongQuestions';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

type ParamsType = {
  payloads: {
    userId: string;
    questionId: string;
    paperType: string;
  }[];
  module: TestingModule;
};
export type CreateUserWrongQuestionsRetType = {
  userWrongQuestions: UserWrongQuestions[];
  finalize: () => void;
};
export const createUserWrongQuestions = async ({
  payloads,
  module,
}: ParamsType): Promise<CreateUserWrongQuestionsRetType> => {
  const userWrongQuestionsData = payloads.map((payload) => {
    return {
      userId: payload.userId,
      questionId: payload.questionId,
      paperType: payload.paperType,
    };
  });
  const userWrongQuestionsRepository = module.get<Repository<UserWrongQuestions>>(
    getRepositoryToken(UserWrongQuestions)
  );
  // create userWrongQuestions
  const userWrongQuestions = await userWrongQuestionsRepository.save(userWrongQuestionsData);
  return {
    userWrongQuestions,
    finalize: async () => {
      await userWrongQuestionsRepository.delete({
        id: In(userWrongQuestions.map((data) => data.id)),
      });
    },
  };
};
