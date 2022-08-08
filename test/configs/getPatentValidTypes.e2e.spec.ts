import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/configs/getPatentValidTypes', () => {

  test('should get /configs/getPatentValidTypes', async () => {
    const result = await request(tester.server).get('/configs/getPatentValidTypes').query({});
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.patentValidTypes).toBeTruthy();
  });
});
