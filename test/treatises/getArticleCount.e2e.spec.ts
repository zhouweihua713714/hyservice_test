import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getArticleCount.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getArticleCount', () => {
  test('should GET /treatises/getArticleCount', async () => {
    // make request
    const result = await request(tester.server).get('/treatises/getArticleCount').query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.columns).toBeTruthy();
  });
});
