import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getTermCountByProvince.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/getTermCountByProvince', () => {
  test('should GET /terms/getTermCountByProvince', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getTermCountByProvince')
      .query({ columnId: tester.data.terms[0].columnId});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.provinceCounts).toBeTruthy();
  });
});
