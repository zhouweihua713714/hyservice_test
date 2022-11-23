import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listResearchReports.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/reports/listResearchReports', () => {
  test('should POST /reports/listResearchReports', async () => {
    // make request
    const result = await request(tester.server)
      .post('/reports/listResearchReports')
      .send({ page: 1, size: 2 });

    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.reports).toBeTruthy();
    expect(result.body.data.count).toBe(1);
  });
});
