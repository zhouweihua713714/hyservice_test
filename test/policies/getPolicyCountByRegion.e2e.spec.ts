import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getPolicyCountByRegion.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/policies/getPolicyCountByRegion', () => {
  test('should GET /policies/getPolicyCountByRegion', async () => {
    // make request
    const result = await request(tester.server)
      .get('/policies/getPolicyCountByRegion')
      .query({  });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.regions).toBeTruthy();
    expect(result.body.data.regions.length).toBe(5);
  });
});
