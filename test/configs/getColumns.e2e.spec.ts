import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/configs/getColumns', () => {

  test('should get /configs/getColumns', async () => {
    const result = await request(tester.server).get('/configs/getColumns').query({});
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.columns).toBeTruthy();
  });
});
