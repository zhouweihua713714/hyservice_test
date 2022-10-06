import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getInstitutionsByCoordinate.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/institutions/getInstitutionsByCoordinate', () => {
  test('should GET /institutions/getInstitutionsByCoordinate', async () => {
    // make request
    const result = await request(tester.server)
      .get('/institutions/getInstitutionsByCoordinate')
      .query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.institutions).toBeTruthy();
  });
});
