import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getPatentCharts.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/patents//getPatentCharts', () => {
  test('should GET /patents/getPatentCharts by applicant', async () => {
    // make request
    const result = await request(tester.server)
      .get('/patents/getPatentCharts')
      .query({ type: 'applicant' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.patents).toBeTruthy();
    expect(result.body.data.patents.length).toBe(4);
  });
  test('should GET /patents/getPatentCharts by year', async () => {
    // make request
    const result = await request(tester.server)
      .get('/patents/getPatentCharts')
      .query({ type: 'year' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.patents).toBeTruthy();
    expect(result.body.data.patents.length).toBe(4);
  });
  test('should GET /patents/getPatentCharts by type', async () => {
    // make request
    const result = await request(tester.server)
      .get('/patents/getPatentCharts')
      .query({ type: 'type' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.patents).toBeTruthy();
    expect(result.body.data.patents.length).toBe(3);
  });
});
