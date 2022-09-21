import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import { Content_Status_Enum, Labels_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Treatises } from '@/entities/Treatises.entity';
import { UserNoteTreatises } from '@/entities/UserNoteTreatises.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let noteTreatises: UserNoteTreatises[];
export type DataType = {
  user: CreateUserRetType;
  noteTreatises: UserNoteTreatises[];
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
    // treatises
    const treatises = await tester.treatisesRepository.save([
      {
        id: (new Date().getTime() - 50000).toString(),
        columnId: columns[1].id,
        title: '论文匹配',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 50000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 40000).toString(),
        columnId: columns[1].id,
        title: '论文名称必填',
        ownerId: user.user.id,
        publishedAt: new Date(new Date().getTime() - 40000),
        status: Content_Status_Enum.ACTIVE,
      },
      {
        id: (new Date().getTime() - 30000).toString(),
        columnId: columns[1].id,
        title: '论文名称必填',
        ownerId: user.user.id,
        status: Content_Status_Enum.READY,
        publishedAt: new Date(new Date().getTime() - 40000),
      },
    ]);
    // user favorites
    await tester.userFavoriteTreatisesRepository.save(
      treatises.map((data) => {
        return {
          userId: user.user.id,
          treatise: {
            id: data.id,
          },
        };
      })
    );
    // user label treatises
    await tester.userLabelTreatisesRepository.save([
      ...treatises.map((data) => {
        return {
          userId: user.user.id,
          treatise: {
            id: data.id,
          },
          label: Labels_Enum.Label_001,
        };
      }),
      {
        userId: '233',
        treatise: {
          id: treatises[0].id,
        },
        label: Labels_Enum.Label_001,
      },
      {
        userId: '234',
        treatise: {
          id: treatises[0].id,
        },
        label: Labels_Enum.Label_002,
      },
    ]);
    return { user, noteTreatises };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.userFavoriteTreatisesRepository.delete({});
    await tester.userNoteTreatisesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
