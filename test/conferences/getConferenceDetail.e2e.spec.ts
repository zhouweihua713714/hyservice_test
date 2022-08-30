import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getConferenceDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/conferences/getConferenceDetail', () => {
  test('should not GET /conferences/getConferenceDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/conferences/getConferenceDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /conferences/getConferenceDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/conferences/getConferenceDetail')
      .query({ id: tester.data.conferenceInfo.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
