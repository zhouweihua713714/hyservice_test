import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexTerm.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/listComplexTerm', () => {
  test('should GET /terms/listComplexTerm with invalid type', async () => {
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
  test('should GET /terms/listComplexTerm with type', async () => {
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
  test('should GET /terms/listComplexTerm with authorizeAt', async () => {
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
  test('should GET /terms/listComplexTerm with unit', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ unit: '单位模糊匹配', page: 1, size: 2});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(1);
    expect(result.body.data.count).toBe(1);
  });
  test('should GET /terms/listComplexTerm with principal', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ principal: '项目负责人', page: 1, size: 2});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should GET /terms/listComplexTerm with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '名称模糊匹配;关键字词模糊', page: 1, size: 2});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.terms).toBeTruthy();
    expect(result.body.data.terms.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
  test('should GET /terms/listComplexTerm with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '名称模糊匹配;关键字词模糊;项目',
        type:tester.data.termType.id,
        authorizeAt: new Date(),
        unit:'单位',
        principal:'负责人',
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
});
