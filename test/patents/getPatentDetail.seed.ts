import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { PatentTypes } from '@/entities/PatentTypes.entity';
import { Patents } from '@/entities/Patents.entity';
import { PatentValidTypes } from '@/entities/PatentValidTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let patentValidType: PatentValidTypes;
let patentType: PatentTypes;
let patentInfo: Patents;
export type DataType = {
  user: CreateUserRetType;
  patentInfo: Patents;
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
    patentValidType = await tester.patentValidTypesRepository.save(
      { id: `P${genCodeOfLength(8)}`, name: '专利有效性'},
    );
    patentType = await tester.patentTypesRepository.save({
      id: `P${genCodeOfLength(8)}`,
      name: '专利类型名称',
    });
    patentInfo = await tester.patentsRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      type: patentType.id,
      title: '专利标题名称必填',
      abstract: '摘要',
      applicant: '申请人',
      announcedNo: '公开号',
      announcedAt: new Date(),
      appliedAt: new Date(),
      appliedNo: '申请号',
      country: '中国',
      agency: '代理机构',
      agent: '代理人',
      validStatus: patentValidType.id,
      keyword: '关键字',
      ownerId: user.user.id,
    });
    return { user, patentInfo };
  },
  down: async (tester) => {
    await tester.patentsRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.patentValidTypesRepository.delete({});
    await tester.patentTypesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
