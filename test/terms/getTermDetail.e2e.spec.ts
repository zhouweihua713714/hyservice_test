import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { websiteRepository } from '@/modules/repository/repository';
import { DBTester } from '../testHelper';
import { DataType } from './getTermDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/getTermDetail', () => {
  test('should not GET /terms/getTermDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getTermDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /terms/getTermDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getTermDetail')
      .query({ id: tester.data.termInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
