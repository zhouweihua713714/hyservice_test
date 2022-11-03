import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getAmericaTermOverview.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/getTermCountByYear', () => {
  test('should GET /terms/getAmericaTermOverview', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getAmericaTermOverview')
      .query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms[0].amount).toBe(tester.data.americaTerms[0].awardedAmountToDate);
  });
});
