import { UserPaperTypes } from '@/entities/UserPaperTypes';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type ParamsType = {
  paperType: string;
  userId: string;
};

export type CreateUserPaperRetType = {
  userPaperType: UserPaperTypes;
  finalize: () => void;
};

export const createUserPaperType = async (
  { userId, paperType }: ParamsType,
  module: TestingModule
): Promise<CreateUserPaperRetType> => {
  // 获取userPaperTypesRepository
  const userPaperTypesRepository = module.get<Repository<UserPaperTypes>>(
    getRepositoryToken(UserPaperTypes)
  );
  // delete before create
  await userPaperTypesRepository.delete({ userId });
  // create user exercise
  const userPaperType = await userPaperTypesRepository.save({
    userId,
    paperType,
  });
  return {
    userPaperType,
    finalize: async () => {
      await userPaperTypesRepository.delete({ userId });
    },
  };
};
