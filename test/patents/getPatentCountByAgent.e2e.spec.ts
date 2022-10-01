import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './getPatentCountByAgent.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/patents//getPatentCountByAgent', () => {
  test('should GET /patents/getPatentCountByAgent', async () => {
    // make request
    const result = await request(tester.server).get('/patents/getPatentCountByAgent').query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.agents).toBeTruthy();
    expect(result.body.data.agents.length).toBe(4);
  });
});
