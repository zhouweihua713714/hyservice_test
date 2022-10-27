import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './listUserSearchKeywords.seed';

const tester = new DBTester<DataType>().setup();

describe('/users/listUserSearchKeywords', () => {
  test('should not GET before login', async () => {
    const result = await request(tester.server)
      .get('/users/listUserSearchKeywords')
      .query({});

    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should GET /users/listUserSearchKeywords', async () => {
    const result = await request(tester.server)
      .get('/users/listUserSearchKeywords')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({});
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.keywords).toBeTruthy();
  });
});
