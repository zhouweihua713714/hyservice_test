import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import {
  Content_Status_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { TermTypes } from '@/entities/TermTypes.entity';
import { AmericaTerms } from '@/entities/AmericaTerms.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let termType: TermTypes;
let americaTerms: AmericaTerms[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  americaTerms: AmericaTerms[];
  termType: TermTypes,
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    normalUser = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.User },
      tester.authService
    );
    columns = await tester.columnsRepository.save([
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: '0', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: '1', sequenceNumber: 1 },
    ]);
    termType = await tester.termTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '项目类型名称',
    });
    americaTerms = await tester.americaTermsRepository.save([
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
    return { user, normalUser, americaTerms, termType };
  },
  down: async (tester) => {
    await tester.americaTermsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
