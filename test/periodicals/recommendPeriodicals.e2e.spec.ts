import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './recommendPeriodicals.seed';

const tester = new DBTester<DataType>().setup();

describe('/periodicals/recommendPeriodicals', () => {
  test('should POST /periodicals/recommendPeriodicals with invalid params', async () => {
    // save with
    const result = await request(tester.server)
      .post('/periodicals/recommendPeriodicals')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: 'invalid',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.periodicals).toBeTruthy;
    expect(result.body.data.periodicals.length).toBe(0);
  });
  test('should POST /periodicals/recommendPeriodicals', async () => {
    // save with
    const result = await request(tester.server)
      .post('/periodicals/recommendPeriodicals')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.periodicals).toBeTruthy;
    expect(result.body.data.periodicals.length).toBe(2);
  });
});
