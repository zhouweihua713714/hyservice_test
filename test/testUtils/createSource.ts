import faker from '@faker-js/faker';
import { QuestionSource } from '@/entities/QuestionSource';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

export type CreateQuestionSourceRetType = {
  questionSource: QuestionSource;
  finalize: () => void;
};

export const createQuestionSource = async (
  module: TestingModule
): Promise<CreateQuestionSourceRetType> => {
  const questionSourceRepository = module.get<Repository<QuestionSource>>(
    getRepositoryToken(QuestionSource)
  );
  //arguments
  const description = faker.name.findName();
  // delete before create
  await questionSourceRepository.delete({ description });
  // create question source
  const questionSource = await questionSourceRepository.save({
    description: description,
  });
  return {
    questionSource,
    finalize: async () => {
      await questionSourceRepository.delete({ description });
    },
  };
};
