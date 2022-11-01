import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getResearchObjects.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getResearchObjects', () => {
  test('should GET /treatises/getResearchObjects', async () => {
    // make request
    const result = await request(tester.server).get('/treatises/getResearchObjects').query({
      columnId: tester.data.columns[0].id,
    });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.objects).toBeTruthy();
  });
});
