import { Content_Status_Enum, Peking_Unit_Enum } from '@/common/enums/common.enum';
import { SavePeriodicalDto } from '@/modules/periodicals/periodicals.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './savePeriodical.seed';

const tester = new DBTester<DataType>().setup();
const payload: SavePeriodicalDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  name: '期刊名称必填',
  columnId: 'tester.data.columns[1].id',
  type: 'periodical',
  introduction: '简介300字',
  language: [],
  region: '中国,美国',
  field: '教育学',
  minorField: '教育学子领域;教育学子领域2',
  url: 'http://baidu.com',
  address: '这里是地址',
  search: '引用情况',
  impactFactor: 3.564,
  establishedAt: new Date(),
  publisher: '出版商',
  period: '需要赋值',
  manager: '主管单位',
  organizer: '主办单位',
  ISSN: '20220816-8-25',
  CN: '国内统一刊号',
  pekingUnit: ['journals_001', 'journals_002'],
  honor: '期刊荣誉',
  articleNumber: 1000,
  quote: 12000,
  downloads: 1000,
  subject: [],
  compositeImpactFactor: 6.789,
  checkPeriod: '审稿周期',
  releasePeriod: '发稿周期',
  recordRate: 88.8,
  checkFee: 1520.12,
  pageFee: 1521.14,
  reward: 112.56,
  coverUrl: '封面链接',
  citeScore: 80.1,
  citeRate: 82,
};

describe('/periodicals/savePeriodical', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/periodicals/savePeriodical').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /periodicals/savePeriodical with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /periodicals/savePeriodical with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', name: '期刊名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /periodicals/savePeriodical with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        name: '期刊名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /periodicals/savePeriodical with invalid type', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, type: 'invalid id', name: '期刊名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20002);
  });
  test('should not POST /periodicals/savePeriodical with invalid subject', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        subject: ['invalid id'],
        columnId: tester.data.columns[1].id,
        name: '期刊名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20003);
  });
  test('should not POST /periodicals/savePeriodical with illegal subject', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        subject: [tester.data.subjects[1].id],
        columnId: tester.data.columns[1].id,
        name: '期刊名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20003);
  });
  test('should not POST /periodicals/savePeriodical with invalid language', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        name: '期刊名称',
        language: ['invalid-id'],
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20006);
  });
  test('should not POST /periodicals/savePeriodical with invalid period', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        name: '期刊名称',
        period: ['invalid-id'],
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20007);
  });
  test('should not POST /periodicals/savePeriodical with invalid peking unit', async () => {
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        name: '期刊名称',
        pekingUnit: ['invalid-id'],
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20008);
  });
  test('should POST /periodicals/savePeriodical', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.language = [tester.data.language.id];
    payload.pekingUnit = [Peking_Unit_Enum.JOURNALS_001];
    payload.subject = [tester.data.subjects[0].id];
    payload.period = tester.data.periodicalPeriod.id;
    // save with
    const result = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        type: payload.type,
        name: '这是新增',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/periodicals/savePeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.termsRepository.delete(result.body.data.id);
  });
});
