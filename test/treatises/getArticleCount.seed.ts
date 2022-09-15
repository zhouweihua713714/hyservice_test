import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Content_Status_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Treatises } from '@/entities/Treatises.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let treatises: Treatises[];
export type DataType = {
  user: CreateUserRetType;
  columns: Columns[];
};

export const seed: TesterSeed<DataType> = {
  up: async (tester) => {
    user = await tester.usersDao.createUser(
      { mobile, password, type: User_Types_Enum.Administrator },
      tester.authService
    );
    columns = await tester.columnsRepository.save([
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称', parentId: 'column_02', sequenceNumber: 1 },
      { id: `C${genCodeOfLength(8)}`, name: '栏目名称1', parentId: 'column_02', sequenceNumber: 2 },
    ]);
    treatises = await tester.treatisesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[0].id,
        title: '论文1',
        ownerId: user.user.id,
        updatedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[0].id,
        title: '论文2',
        ownerId: user.user.id,
        updatedAt: new Date(new Date().getTime() - 40000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[0].id,
        title: '论文3',
        ownerId: user.user.id,
        updatedAt: new Date(new Date().getTime() - 30000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 20000).toString(),
        columnId: columns[0].id,
        title: '论文4',
        ownerId: user.user.id,
        updatedAt: new Date(new Date().getTime() - 20000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: new Date().getTime().toString(),
        columnId: columns[1].id,
        title: '论文5',
        ownerId: user.user.id,
        updatedAt: new Date(),
        status: Content_Status_Enum.ACTIVE,
      },
    ]);
    return { user, columns };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
