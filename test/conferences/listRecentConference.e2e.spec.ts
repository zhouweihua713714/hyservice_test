import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listRecentConference.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/conferences/listRecentConference', () => {
  test('should GET /conferences/listRecentConference', async () => {
    // make request
    const result = await request(tester.server)
      .get('/conferences/listRecentConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(4);
  });
});
