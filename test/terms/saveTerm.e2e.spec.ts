import { SaveTermDto } from '@/modules/terms/terms.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './saveTerm.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveTermDto = {
  name: '项目名称必填',
  columnId: 'tester.data.columns[1].id',
  type: 'tester.data.termType.id',
  subject: 'tester.data.subjects[0].id',
  province: '350000',
  unit: '依托单位',
  principal: '项目负责人',
  termNumber: 'YH35000111',
  keyword: '项目;关键词;其他',
  money: 22,
  department: '教育学部',
  subjectNo: 'XK0001',
  authorizedAt: new Date(),
  startedAt: new Date(new Date().getTime() - 60000),
  endedAt: new Date(),
};

describe('/terms/saveTerms', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/terms/saveTerms').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /terms/saveTerms with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /terms/saveTerms with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', type: tester.data.termType.id, name: '项目名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /terms/saveTerms with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        type: tester.data.termType.id,
        name: '项目名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /terms/saveTerms with invalid type', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, type: 'invalid id', name: '项目名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20002);
  });
  test('should not POST /terms/saveTerms with invalid subject', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        subject: 'invalid id',
        columnId: tester.data.columns[1].id,
        type: tester.data.termType.id,
        name: '项目名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20003);
  });
  test('should not POST /terms/saveTerms with illegal subject', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        subject: tester.data.subjects[1].id,
        columnId: tester.data.columns[1].id,
        type: tester.data.termType.id,
        name: '项目名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20003);
  });
  test('should not POST /terms/saveTerms with startedAt error', async () => {
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        name: '项目名称',
        startedAt: new Date(),
        endedAt: new Date(),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20004);
  });
  test('should POST /terms/saveTerms', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.type = tester.data.termType.id;
    payload.subject = tester.data.subjects[0].id;
    // save with id
    const result = await request(tester.server)
      .post('/terms/saveTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ ...payload });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    await tester.termsRepository.delete(result.body.data.id);
  });
});
