import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import {
  Content_Status_Enum,
  Education_Level_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Policies } from '@/entities/Policies.entity';
import { constant } from '@/common/utils/constant';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let policyType: PolicyTypes;
let policyInfo: Policies;
export type DataType = {
  user: CreateUserRetType;
  policyInfo: Policies;
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
    policyType = await tester.policyTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '政策类型名称',
    });
    const topicType = await tester.topicTypesRepository.save([
      {
        id: `T${genCodeOfLength(8)}`,
        name: '主题类型名称',
      },
      {
        id: `T${genCodeOfLength(8)}`,
        name: '主题类型名称1',
      },
    ]);
    policyInfo = await tester.policiesRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      type: policyType.id,
      topicType: [topicType[0].id, topicType[1].id],
      status: Content_Status_Enum.ACTIVE,
      name: '政策名称必填',
      announceNo: '发文号',
      level: constant.POLICY_LEVEL,
      institution: '机构名称',
      educationLevel: [Education_Level_Enum.BASIC, Education_Level_Enum.HIGHER],
      keyword: '关键字;政策',
      announcedAt: new Date(),
      introduction: '简介最多300',
      region: '中国',
      url: 'http://baidu.com',
      ownerId: user.user.id,
    });
    return { user, policyInfo };
  },
  down: async (tester) => {
    await tester.policiesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
