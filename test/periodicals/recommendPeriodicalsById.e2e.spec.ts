import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './recommendPeriodicalsById.seed';

const tester = new DBTester<DataType>().setup();

describe('/periodicals/recommendPeriodicalsById', () => {
  test('should POST /periodicals/recommendPeriodicalsById with invalid params', async () => {
    // save with
    const result = await request(tester.server)
      .post('/periodicals/recommendPeriodicalsById')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.periodicals).toBeTruthy;
    expect(result.body.data.periodicals.length).toBe(8);
  });
  test('should POST /periodicals/recommendPeriodicalsById', async () => {
    // save with
    const result = await request(tester.server)
      .post('/periodicals/recommendPeriodicalsById')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.periodicals[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.periodicals).toBeTruthy;
    expect(result.body.data.periodicals.length).toBe(8);
  });
});
