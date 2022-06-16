import faker from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Nodes } from '@/entities/Nodes';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

export type CreateNodesRetType = {
  nodes: Nodes[];
  finalize: () => void;
};

export const createNodes = async (module: TestingModule): Promise<CreateNodesRetType> => {
  const course = uuidv4();
  const chapter = uuidv4();
  const childChapter = uuidv4();
  const node = uuidv4();
  const nodeOne = uuidv4();
  const nodesRepository = module.get<Repository<Nodes>>(getRepositoryToken(Nodes));
  // delete before create
  await nodesRepository.delete([course, chapter, childChapter, node]);
  // create nodes (is leaf)
  const nodes = await nodesRepository.save([
    {
      id: course,
      name: `课程:${faker.name.findName()}`,
      parentId: '0',
      paperTypes: null,
      isLeaf: 0,
      path: '0',
      sequenceNumber: 1,
    },
    {
      id: chapter,
      name: `章节:${faker.name.findName()}`,
      parentId: course,
      paperTypes: null,
      isLeaf: 0,
      path: `0,${course}`,
      sequenceNumber: 1,
    },
    {
      id: childChapter,
      name: `子章节:${faker.name.findName()}`,
      parentId: chapter,
      paperTypes: null,
      isLeaf: 0,
      path: `0,${course},${chapter}`,
      sequenceNumber: 1,
    },
    {
      id: node,
      name: `知识点1:${faker.name.findName()}`,
      parentId: childChapter,
      paperTypes: ['math_one'],
      isLeaf: 1,
      path: `0,${course},${chapter},${childChapter}`,
      sequenceNumber: 1,
    },
    {
      id: nodeOne,
      name: `知识点2:${faker.name.findName()}`,
      parentId: childChapter,
      paperTypes: ['math_one'],
      isLeaf: 1,
      path: `0,${course},${chapter},${childChapter}`,
      sequenceNumber: 2,
    },
  ]);
  return {
    nodes,
    finalize: async () => {
      await nodesRepository.delete([course, chapter, childChapter, node, nodeOne]);
    },
  };
};
