import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getNoteTreatiseDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/users/getNoteTreatiseDetail', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .get('/users/getNoteTreatiseDetail')
      .query({ id: 'invalid id' });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not GET /users/getNoteTreatiseDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/getNoteTreatiseDetail')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.user.user.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /users/getNoteTreatiseDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/getNoteTreatiseDetail')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.noteTreatiseInfo.id, flag: true });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
