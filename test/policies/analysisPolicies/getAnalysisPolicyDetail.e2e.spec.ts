import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getAnalysisPolicyDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/policies/getAnalysisPolicyDetail', () => {
  test('should not GET /policies/getAnalysisPolicyDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/policies/getAnalysisPolicyDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /policies/getAnalysisPolicyDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/policies/getAnalysisPolicyDetail')
      .query({ id: tester.data.analysisPolicyInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
