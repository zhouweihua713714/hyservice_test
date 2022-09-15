import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Terms } from '@/entities/Terms.entity';
import { Treatises } from '@/entities/Treatises.entity';
import { Policies } from '@/entities/Policies.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
import { Patents } from '@/entities/Patents.entity';
import { Institutions } from '@/entities/Institutions.entity';
import { Conferences } from '@/entities/Conferences.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let term: Terms;
let treatise: Treatises;
let policy: Policies;
let periodical: Periodicals;
let patent: Patents;
let institution: Institutions;
let conference: Conferences;
export type DataType = {
  user: CreateUserRetType;
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    columns = await tester.columnsRepository.save([
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: '0', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: '1', sequenceNumber: 1 },
    ]);
    term = await tester.termsRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      name: '项目名称4',
      ownerId: user.user.id,
    });
    treatise = await tester.treatisesRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      title: '论文标题必填',
      ownerId: user.user.id,
    });
    policy = await tester.policiesRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      name: '政策名称必填',
      ownerId: user.user.id,
    });
    periodical = await tester.periodicalsRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      name: '期刊名称',
    });
    patent = await tester.patentsRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      title: '专利标题名称必填',
    });
    institution = await tester.institutionsRepository.save({
      id: new Date().getTime().toString(),
      name: '机构名称必填',
      columnId: columns[1].id,
    });
    conference = await tester.conferencesRepository.save({
      id: new Date().getTime().toString(),
      name: '会议名称必填',
      columnId: columns[1].id,
    });
    // insert user history
    await tester.userHistoryRepository.save([
      { userId: user.user.id, relatedId: term.id, type: Content_Types_Enum.TERM },
      { userId: user.user.id, relatedId: treatise.id, type: Content_Types_Enum.TREATISE },
      { userId: user.user.id, relatedId: policy.id, type: Content_Types_Enum.POLICY },
      { userId: user.user.id, relatedId: periodical.id, type: Content_Types_Enum.PERIODICAL },
      { userId: user.user.id, relatedId: patent.id, type: Content_Types_Enum.PATENT },
      { userId: user.user.id, relatedId: institution.id, type: Content_Types_Enum.INSTITUTION },
      { userId: user.user.id, relatedId: conference.id, type: Content_Types_Enum.CONFERENCE },
    ]);

    return { user };
  },
  down: async (tester) => {
    await tester.termsRepository.delete({});
    await tester.treatisesRepository.delete({});
    await tester.policiesRepository.delete({});
    await tester.periodicalsRepository.delete({});
    await tester.patentsRepository.delete({});
    await tester.institutionsRepository.delete({});
    await tester.conferencesRepository.delete({});
    await tester.userHistoryRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
