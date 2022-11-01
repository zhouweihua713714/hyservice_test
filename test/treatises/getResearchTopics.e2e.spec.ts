import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getResearchTopics.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getResearchTopics', () => {
  test('should GET /treatises/getResearchTopics', async () => {
    // make request
    const result = await request(tester.server).get('/treatises/getResearchTopics').query({
      columnId: tester.data.columns[0].id,
    });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.topics).toBeTruthy();
  });
});
