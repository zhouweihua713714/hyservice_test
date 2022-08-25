import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getPatentDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/patents/getPatentDetail', () => {
  test('should not GET /patents/getPatentDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/patents/getPatentDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /patents/getPatentDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/patents/getPatentDetail')
      .query({ id: tester.data.patentInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
