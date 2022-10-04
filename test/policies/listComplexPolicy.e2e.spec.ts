import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexPolicy.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/policies/listComplexPolicy', () => {
  test('should POST /policies/listComplexPolicy with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '政策;关键词匹配', page: 1, size: 3 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(3);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /policies/listComplexPolicy with type', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ type: tester.data.policyType.id, page: 1, size: 3 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(3);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /policies/listComplexPolicy with topicType', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ topicType: '主题类型匹配', page: 1, size: 3 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(3);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /policies/listComplexPolicy with columnId', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, page: 1, size: 3 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(3);
    expect(result.body.data.count).toBe(5);
  });
  test('should POST /policies/listComplexPolicy with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '政策;关键词匹配;不匹配',
        columnId: tester.data.columns[1].id,
        type: tester.data.policyType.id,
        topicType: '主题类型匹配',
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
});
