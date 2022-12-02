import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import {
  Content_Status_Enum,
  Content_Types_Enum,
  Education_Level_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { constant } from '@/common/utils/constant';
import { Policies } from '@/entities/Policies.entity';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let policyType: PolicyTypes;
let policies: Policies[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  policies: Policies[];
  columns: Columns[];
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
    policyType = await tester.policyTypesRepository.save({
      id: `T${genCodeOfLength(8)}`,
      name: '政策类型名称',
    });
    policies = await tester.policiesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
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
        endedAt: new Date(),
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
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
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        type: policyType.id,
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
        updatedAt: new Date(new Date().getTime() - 50000),
      },
    ]);
    return { user, normalUser, policies, columns };
  },
  down: async (tester) => {
    await tester.policiesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.policyTypesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
