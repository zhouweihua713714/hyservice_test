import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getParentConferences.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/conferences/getParentConferences', () => {
  test('should not GET /conferences/getParentConferences with user is not admin', async () => {
    // make request
    const result = await request(tester.server)
      .get('/conferences/getParentConferences')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(3);
  });
});
