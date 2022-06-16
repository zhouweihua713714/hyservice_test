import faker from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Files } from '@/entities/Files';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

export type CreateFilesRetType = {
  files: Files[];
  finalize: () => void;
};
type ParamsType = {
  payloads: {
    status: number;
  }[];
  module: TestingModule;
};

export const createFiles = async ({
  payloads,
  module,
}: ParamsType): Promise<CreateFilesRetType> => {
  const filesData = payloads.map((file) => {
    return {
      id: uuidv4(),
      filename: faker.name.findName().slice(0, 19),
      status: file.status,
    };
  });
  const filesRepository = module.get<Repository<Files>>(getRepositoryToken(Files));
  // delete before create
  await filesRepository.delete(filesData.map((file) => file.id));
  // create files
  const files = await filesRepository.save(filesData);
  return {
    files,
    finalize: async () => {
      await filesRepository.delete(filesData.map((file) => file.id));
    },
  };
};
