import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getPeriodicalDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/periodicals/getPeriodicalDetail', () => {
  test('should not GET /periodicals/getPeriodicalDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/periodicals/getPeriodicalDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /periodicals/getPeriodicalDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/periodicals/getPeriodicalDetail')
      .query({ id: tester.data.periodicalInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
