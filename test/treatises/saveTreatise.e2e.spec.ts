import { Channels_Enum, Content_Status_Enum, Peking_Unit_Enum } from '@/common/enums/common.enum';
import { SaveTreatiseDto } from '@/modules/treatises/treatises.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './saveTreatise.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveTreatiseDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  title: '论文名称必填',
  columnId: 'tester.data.columns[1].id',
  language: '需要赋值',
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
  sort: '文章类型需要赋值',
  abstract: '摘要不限制字数',
  references: '参考文献不限字数',
  quote: 0,
  fundedProject: '所获资助项目限制500',
  keyword: '关键词',
  name:'期刊/会议名'
};

describe('/treatises/saveTreatise', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/treatises/saveTreatise').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /treatises/saveTreatise with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /treatises/saveTreatise with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', title: '论文名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /treatises/saveTreatise with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        title: '论文名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /treatises/saveTreatise with invalid language', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        title: '论文名称',
        language: 'invalid-id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20006);
  });
  test('should not POST /treatises/saveTreatise with invalid channel', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        title: '论文名称',
        channel: 'invalid-id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20011);
  });
  test('should not POST /treatises/saveTreatise with invalid sort', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        title: '论文名称',
        sort: 'invalid-id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20012);
  });
  test('should POST /treatises/saveTreatise', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.language = tester.data.language.id;
    payload.sort = tester.data.articleType.id;

    // save with
    const result = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        title: '这是新增',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/treatises/saveTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.termsRepository.delete(result.body.data.id);
  });
});
