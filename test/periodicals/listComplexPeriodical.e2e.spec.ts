import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexPeriodical.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/periodicals/listComplexPeriodical', () => {
  test('should POST /periodicals/listComplexPeriodical with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/periodicals/listComplexPeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword:'关键词;期刊', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.periodicals).toBeTruthy();
    expect(result.body.data.periodicals.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
  test('should POST /periodicals/listComplexPeriodical with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/periodicals/listComplexPeriodical')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '期刊;名称',
        columnId: tester.data.columns[1].id,
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.periodicals).toBeTruthy();
    expect(result.body.data.periodicals.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
});
