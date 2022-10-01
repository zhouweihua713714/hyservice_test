import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexPatent.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/patents/listComplexPatent', () => {
  test('should POST /patents/listComplexPatent with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/patents/listComplexPatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '标题匹配;摘要匹配;关键字匹配', page: 1, size: 3 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.patents).toBeTruthy();
    expect(result.body.data.patents.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /patents/listComplexPatent with type', async () => {
    // make request
    const result = await request(tester.server)
      .post('/patents/listComplexPatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ type: tester.data.patents[0].type, page: 1, size: 3 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.patents).toBeTruthy();
    expect(result.body.data.patents.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /patents/listComplexPatent with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/patents/listComplexPatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '标题匹配;摘要匹配;关键字匹配',
        type: tester.data.patents[0].type,
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.patents).toBeTruthy();
    expect(result.body.data.patents.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
});
