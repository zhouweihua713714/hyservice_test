import { TesterSeed } from '../testHelper';
import { CreateUserRetType } from '@/dao/users.dao';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { samples } from '../samples';
import { Channels_Enum, Content_Types_Enum, User_Types_Enum } from '@/common/enums/common.enum';
import { Columns } from '@/entities/Columns.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { Languages } from '@/entities/Languages.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
import { ArticleTypes } from '@/entities/ArticleTypes.entity';
import { Treatises } from '@/entities/Treatises.entity';
const { mobile, password } = samples;

let user: CreateUserRetType;
let columns: Columns[];
let subjects: Subjects[];
let treatiseInfo: Treatises;
let articleType: ArticleTypes;
let language: Languages;
export type DataType = {
  user: CreateUserRetType;
  treatiseInfo: Treatises;
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
    subjects = await tester.subjectsRepository.save([
      { id: `S${genCodeOfLength(8)}`, name: '学科名称', type: Content_Types_Enum.PERIODICAL },
      { id: `S${genCodeOfLength(8)}`, name: '学科名称1', type: Content_Types_Enum.PATENT },
    ]);
    language = await tester.languagesRepository.save({
      id: `L${genCodeOfLength(8)}`,
      name: '语种名称',
      type: `${Content_Types_Enum.TREATISE}`,
    });
    articleType = await tester.articleTypesRepository.save({
      id: `A${genCodeOfLength(8)}`,
      name: '文章类型名称',
      type: `${Content_Types_Enum.TREATISE}`,
    });
    treatiseInfo = await tester.treatisesRepository.save({
      id: new Date().getTime().toString(),
      columnId: columns[1].id,
      subject: [subjects[0].id],
      title: '论文名称必填',
      language: language.id,
      region: '中国,美国',
      field: '教育学',
      minorField: '教育学子领域;教育学子领域2',
      url: 'http://baidu.com',
      search: '引用情况',
      deliveryAt: new Date(),
      channel: Channels_Enum.WAY_001,
      author: '第一作者',
      authorUnit: '第一作者单位',
      correspondingAuthor: '通讯作者',
      correspondingAuthorUnit: '通讯作者单位',
      correspondingAuthorEmail: '通讯作者邮箱',
      otherAuthor: '其他作者',
      otherAuthorUnit: '其他作者',
      sort: [articleType.id],
      abstract: '摘要不限制字数',
      references: '参考文献不限字数',
      quote: 0,
      fundedProject: '所获资助项目限制500',
      keyword: '关键词',
      name: '期刊/会议名',
      authorAbbreviation: '作者简称',
      authorAddress: '作者地址',
      correspondingAuthorAddress: '通讯作者地址',
      referencesNumber: 1,
      publisher: '出版商',
      publisherAddress: '出版商地址',
      periodical: '期刊名字',
      periodicalAbbreviation: '期刊简称',
      releasedAt: new Date(),
      doi: '论文doi',
      studyField: '研究方向',
      ownerId: user.user.id,
    });
    return { user, treatiseInfo };
  },
  down: async (tester) => {
    await tester.treatisesRepository.delete({});
    await tester.articleTypesRepository.delete({});
    await tester.columnsRepository.delete({});
    await tester.subjectsRepository.delete({});
    await tester.languagesRepository.delete({});
    await tester.usersRepository.delete({});
    await tester.loginsRepository.delete({});
  },
};
