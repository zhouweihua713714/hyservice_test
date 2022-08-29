import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { PeriodicalPeriods } from '@/entities/PeriodicalPeriods.entity';
import { Languages } from '@/entities/Languages.entity';
import { Fields } from '@/entities/Fields.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let normalUser: CreateUserRetType;
let columns: Columns[];
let fields: Fields[];
export type DataType = {
  user: CreateUserRetType;
  normalUser: CreateUserRetType;
  columns: Columns[];
  fields: Fields[];
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
    fields = await tester.fieldsRepository.save([
      {
        id: `f${genCodeOfLength(8)}`,
        name: '主领域',
        type:Content_Types_Enum.CONFERENCE,
        isMain: 1,
      },
      {
        id: `fn${genCodeOfLength(8)}`,
        name: '子领域',
        type:Content_Types_Enum.CONFERENCE,
        isMain: 0,
      },
    ]);
    return { user, normalUser, columns, fields };
  },
  down: async (tester) => {
    await tester.usersRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.languagesRepository.delete({});
    await tester.periodicalPeriodsRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
