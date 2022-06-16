import { Paper_Types_Enum, Test_Status_Enum } from '@/common/enums/common.enum';
import { Tests } from '@/entities/Tests';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

import _ from 'lodash';
import { TestDetails } from '@/entities/TestDetails';
type ParamsType = {
  payloads: {
    id: string;
    courseId: string;
    chapterId: string;
    type: string;
    status?: string;
    ownerId: string;
    paperTypes?: string[];
    ids: string[];
    createAt?: Date;
  }[];
  module: TestingModule;
};

export type CreateTestsRetType = {
  tests: Tests[];
  finalize: () => void;
};

export const createTests = async ({
  payloads,
  module,
}: ParamsType): Promise<CreateTestsRetType> => {
  const testDetailsRepository = module.get<Repository<TestDetails>>(
    getRepositoryToken(TestDetails)
  );
  const testsRepository = module.get<Repository<Tests>>(getRepositoryToken(Tests));
  // get test data
  const testData = payloads.map((payload) => {
    return {
      id: payload.id,
      name: faker.name.findName(),
      course: {
        id: payload.courseId,
      },
      chapter: {
        id: payload.chapterId,
      },
      type: {
        enumId: payload.type,
      },
      status: {
        enumId: Test_Status_Enum.Active,
      },
      ownerId: payload.ownerId,
      paperTypes: payload.paperTypes
        ? payload.paperTypes
        : [Paper_Types_Enum.MathOne, Paper_Types_Enum.MathTwo, Paper_Types_Enum.MathThree],
      createdAt: payload.createAt ? payload.createAt : new Date(),
    };
  });
  // get test details data
  let testDetailsData: { id?: string; question: { id?: string }; test: { id?: string } }[] = [];
  for (const data of payloads) {
    testDetailsData = _.unionBy(
      testDetailsData,
      data.ids.map((id) => {
        return {
          id: uuidv4(),
          question: {
            id: id,
          },
          test: {
            id: data.id,
          },
          sequenceNumber: 1,
          score: 12,
        };
      }),
      'id'
    );
  }
  // create user exercise
  const tests = await testsRepository.save(testData);
  // create user exercise details
  await testDetailsRepository.save(testDetailsData);
  return {
    tests,
    finalize: async () => {
      await testsRepository.delete(
        tests.map((test) => {
          return test.id;
        })
      );
    },
  };
};
