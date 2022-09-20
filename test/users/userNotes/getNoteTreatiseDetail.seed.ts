import { TesterSeed } from '../../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../../samples';
import { User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Treatises } from '@/entities/Treatises.entity';
import { UserNoteTreatises } from '@/entities/UserNoteTreatises.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let noteTreatiseInfo: UserNoteTreatises;
export type DataType = {
  user: CreateUserRetType;
  noteTreatiseInfo: UserNoteTreatises;
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
    const treatiseInfo = await tester.treatisesRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      title: '论文名称必填',
      ownerId: user.user.id,
      url: '论文链接',
    });
    noteTreatiseInfo = await tester.userNoteTreatisesRepository.save({
      userId: user.user.id,
      treatise: {
        id: treatiseInfo.id,
      },
      comment: '评论',
      content: '笔记内容',
    });
    return { user, noteTreatiseInfo };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.userNoteTreatisesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
