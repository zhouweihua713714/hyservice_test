import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './parseXlsx.seed';
import { HttpStatus } from '@nestjs/common';
const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/files/parseXlsx', () => {
  test('should GET /file/parseXlsx with field id', async () => {
    // make request
    const result = await request(tester.server)
    .post('/file/parseXlsx')
    .send({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
  });
});
