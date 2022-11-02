import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getResearchGoals.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getResearchGoals', () => {
  test('should GET /treatises/getResearchGoals', async () => {
    // make request
    const result = await request(tester.server).get('/treatises/getResearchGoals').query({
      columnId: tester.data.columns[0].id,
    });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.goals).toBeTruthy();
  });
});
