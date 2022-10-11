import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getTermCountByYear.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/getTermCountByYear', () => {
  test('should GET /terms/getTermCountByYear', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getTermCountByYear')
      .query({ columnId: tester.data.terms[0].columnId });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.yearCounts).toBeTruthy();
  });
});
