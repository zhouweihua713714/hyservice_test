import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getAmericaTermDistribution.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/getAmericaTermDistribution', () => {
  test('should GET /terms/getAmericaTermDistribution', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getAmericaTermDistribution')
      .query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms[0].count).toBe(1);
  });
});
