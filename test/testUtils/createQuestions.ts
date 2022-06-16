import { Question_Types_Enum } from '@/common/enums/common.enum';
import { ChildQuestions } from '@/entities/ChildQuestions';
import { NodeQuestions } from '@/entities/NodeQuestions';
import { Questions } from '@/entities/Questions';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

type ParamsType = {
  payloads: {
    source: string;
    type: string;
    status: string;
    ownerId: string;
    nodeId: string;
    id?: string;
    isTest?: number;
    deletedAt?: Date;
  }[];
  module: TestingModule;
};

export type CreateQuestionsRetType = {
  questions: Questions[];
  finalize: () => void;
};

export const createQuestions = async ({
  payloads,
  module,
}: ParamsType): Promise<CreateQuestionsRetType> => {
  // arguments when is_more = 0 just one child question
  const questionData = payloads.map((question) => {
    let answers;
    if (question?.type === Question_Types_Enum.ChoiceQuestion) {
      answers = [
        {
          id: '1',
          content: '这里是答案选项1, 且是 正确答案',
          is_correct: 1,
          image: '这是里图片的id可为空',
        },
        { id: '2', content: '这里是答案选项2', is_correct: 0, image: '这是里图片的id可为空' },
        { id: '3', content: '这里是答案选项3', is_correct: 0, image: '这是里图片的id可为空' },
        { id: '4', content: '这里是答案选项4', is_correct: 0, image: '这是里图片的id可为空' },
      ];
    }
    if (question?.type === Question_Types_Enum.GapFillingQuestion) {
      answers = {
        content: '这里是解答题答案',
      };
    }
    return {
      id: question.id ? question.id : uuidv4(),
      type: {
        enumId: question.type,
      },
      // type: {
      //   enumId: question.type,
      // },
      source: question.source,
      isExam: 1,
      content: { content: '这里是题目内容还可以存在图片', type: 'text' },
      exams: [{ name: '这里是paper_type', year: '2021' }],
      answers: question.type !== Question_Types_Enum.Question ? answers : null,
      prompt: { content: '这里是题目提示还可以存在图片', type: 'text' },
      analysis: { content: '这里是题目解析还可以存在图片', type: 'text' },
      owner: {
        id: question.ownerId,
      },
      status: question.status,
      remarks: '备注',
      reference: '这里是参考图片id',
      isMore: 0,
      isTest: question.isTest ? question.isTest : 0,
      deletedAt: question.deletedAt ? question.deletedAt : null,
    };
  });
  const questionsRepository = module.get<Repository<Questions>>(getRepositoryToken(Questions));

  const childQuestionsRepository = module.get<Repository<ChildQuestions>>(
    getRepositoryToken(ChildQuestions)
  );
  const nodeQuestionsRepository = module.get<Repository<NodeQuestions>>(
    getRepositoryToken(NodeQuestions)
  );

  // delete before create :node_questions child_questions cascade
  const questionIds = questionData.map((question) => question.id);
  await questionsRepository.delete(questionIds);
  // create questions
  const questionsRecords = questionsRepository.create(questionData as unknown as Questions[]);
  const questions = await questionsRepository.save(questionsRecords);
  // create child questions
  await childQuestionsRepository.save(
    questionData.map((question) => {
      return {
        id: question.id,
        question: {
          id: question.id,
        },
        content: { content: '这里是小问题内容,当且单问,单知识点' },
        analysis: { content: '这里是小问题答案和解析' },
        sequenceNumber: 1,
      };
    })
  );
  // create node questions
  await nodeQuestionsRepository.save(
    questionData.map((data) => {
      return {
        nodeId: payloads[0].nodeId,
        question: {
          id: data.id,
        },
        childQuestion: {
          id: data.type.enumId === Question_Types_Enum.Question ? data.id : null,
        },
      } as Partial<NodeQuestions>;
    })
  );
  return {
    questions,
    finalize: async () => {
      await questionsRepository.delete(questionIds);
    },
  };
};
