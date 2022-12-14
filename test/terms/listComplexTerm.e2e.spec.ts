import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexTerm.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/listComplexTerm', () => {
  test('should POST /terms/listComplexTerm with invalid type', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ type: 'invalid id', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.count).toBe(0);
  });
  test('should POST /terms/listComplexTerm with type', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ type: tester.data.termType.id, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /terms/listComplexTerm with authorizeAt', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ authorizeAt: new Date(), page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /terms/listComplexTerm with unit', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ unit: '??????????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(1);
    expect(result.body.data.count).toBe(1);
  });
  test('should POST /terms/listComplexTerm with principal', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ principal: '???????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /terms/listComplexTerm with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '??????????????????;??????????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
  test('should POST /terms/listComplexTerm with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '??????????????????;??????????????????;??????',
        type: tester.data.termType.id,
        authorizeAt: new Date(),
        columnId: tester.data.terms[0].columnId,
        unit: '??????',
        principal: '?????????',
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /terms/listComplexTerm with none condition with column_01_03', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: 'column_01_03',
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(0);
    expect(result.body.data.count).toBe(0);
  });
});
