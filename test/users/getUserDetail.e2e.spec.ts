import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { samples } from '../samples';
import { DBTester } from '../testHelper';
import { DataType } from './getUserDetail.seed';

const tester = new DBTester<DataType>().setup();

describe('/users/getUserDetail', () => {
  test('should not GET before login', async () => {
    const result = await request(tester.server)
      .get('/users/getUserDetail')
      .query({ id: tester.data.user.user.id });

    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should GET /users/getUserDetail', async () => {
    const result = await request(tester.server)
      .get('/users/getUserDetail')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.user.user.id });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
