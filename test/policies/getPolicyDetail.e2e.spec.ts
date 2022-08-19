import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getPolicyDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/policies/getPolicyDetail', () => {
  test('should not GET /policies/getPolicyDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/policies/getPolicyDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /policies/getPolicyDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/policies/getPolicyDetail')
      .query({ id: tester.data.policyInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
