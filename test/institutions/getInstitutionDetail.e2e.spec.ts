import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getInstitutionDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/institutions/getInstitutionDetail', () => {
  test('should not GET /institutions/getInstitutionDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/institutions/getInstitutionDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /institutions/getInstitutionDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/institutions/getInstitutionDetail')
      .query({ id: tester.data.institutionInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
