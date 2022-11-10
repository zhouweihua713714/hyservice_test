import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { treatiseKeywordsRepository } from '@/modules/repository/repository';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
export type DataType = {
  user: CreateUserRetType;
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    await tester.keywordsRepository.save([
      { name: '项目', type: Content_Types_Enum.TERM, frequency: 50 },
      { name: '项目关键词1', type: Content_Types_Enum.TERM },
    ]);
    const columns = await tester.columnsRepository.save([
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: 'column_01', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_01', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称2', parentId: 'column_02', sequenceNumber: 1 },
    ]);
    const treatises = await tester.treatisesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[0].id,
        title: '论文1',
        ownerId: user.user.id,
        updatedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    await treatiseKeywordsRepository.save([
      {
        name: '关键词',
        columnId: columns[2].id,
        treatise: {
          id: treatises[0].id,
        },
        title: '标题',
      },
    ]);
    const terms = await tester.termsRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        name: '名称模糊匹配',
        updatedAt: new Date(new Date().getTime() - 60000),
        startedAt: new Date(new Date().getTime() - 60000),
        publishedAt: new Date(new Date().getTime() - 60000),
        endedAt: new Date(),
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    await tester.termKeywordsRepository.save([
      {
        name: '关键词',
        columnId: columns[1].id,
        term: { id: terms[0].id },
        title: '项目标题',
      },
    ]);
    const americaTerms = await tester.americaTermsRepository.save([
      {
        awardNumber: (new Date().getTime() - 50000).toString(),
        title: 'Contributions of Hippocampal Subsystems to Different Aspects of Episodic Memory',
        program: 'Sci of Lrng & Augmented Intel',
        startDate: '2020-09-01',
        endDate: '2025-02-28',
        principalInvestigator: 'Lloyd Slevc',
        state: 'MD',
        organization: 'University of Maryland,College Park',
        awardInstrument: 'Continuing Grant',
        awardedAmountToDate: 1000000,
        abstract: 'Contributions of Hippocampal Subsystems to Different Aspects of Episodic Memory',
        nsfDirectorate: 'NSFDirectorate_SBE',
        year: '2015',
        status: Content_Status_Enum.ACTIVE,
        enabled: true,
        columnId: 'column_01_04'
      }
    ]);
    await tester.americaTermKeywordsRepository.save([
      {
        name: '关键词',
        columnId: columns[0].id,
        awardNumber: americaTerms[0].awardNumber,
        // americaTerm: { awardNumber: terms[0].id },
        title: '项目标题1',
      },
    ]);
    return { user, normalUser };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.termsRepository.delete({});
    await tester.americaTermKeywordsRepository.delete({});
    await tester.americaTermsRepository.delete({});
    await tester.termKeywordsRepository.delete({});
    await tester.treatiseKeywordsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.keywordsRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
