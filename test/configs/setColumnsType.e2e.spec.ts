import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './setColumnsType.seed';

const tester = new DBTester<DataType>().setup();
const payload = {
  ids: [],
  isHide: 1,
};

describe('/configs/setColumnsType', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/configs/setColumnsType').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /configs/setColumnsType with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/configs/setColumnsType')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });

  test('should not POST /configs/setColumnsType', async () => {
    const result = await request(tester.server)
      .post('/configs/setColumnsType')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.columns.map((column) => {
          return column.id;
        }),
        isHide:1
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(2);
    expect(result.body.data.failed).toBe(0);
  });
});
