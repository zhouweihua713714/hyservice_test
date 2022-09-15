import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './listHistory.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/users/listHistory', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).get('/users/listHistory').query({});
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should GET /users/listHistory ', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/listHistory')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({
        page: 1,
        size: 10,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.userHistory).toBeTruthy();
    expect(result.body.data.userHistory.length).toBe(7);
    expect(result.body.data.count).toBe(7);
  });
});
