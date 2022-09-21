import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getTreatiseDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getTreatiseDetail', () => {
  test('should not GET /treatises/getTreatiseDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/getTreatiseDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /treatises/getTreatiseDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/getTreatiseDetail')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.treatiseInfo.id, flag: true });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    expect(result.body.data.labels).toBeTruthy();
    expect(result.body.data.noteTreatises).toBeTruthy();
    expect(result.body.data.noteTreatises.length).toBe(2);
  });
});
