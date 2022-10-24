import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getKeywordCharts.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getKeywordCharts', () => {
  test('should GET /treatises/getKeywordCharts', async () => {
    // make request
    const result = await request(tester.server).get('/treatises/getKeywordCharts').query({
      columnId: 'column_02_04',
    });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.keywordCharts).toBeTruthy();
  });
});
