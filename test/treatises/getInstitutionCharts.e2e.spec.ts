import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getInstitutionCharts.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getInstitutionCharts', () => {
  test('should GET /treatises/getInstitutionCharts', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/getInstitutionCharts')
      .query({ columnId: tester.data.columns[1].id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.institutionCharts).toBeTruthy();
  });
});
