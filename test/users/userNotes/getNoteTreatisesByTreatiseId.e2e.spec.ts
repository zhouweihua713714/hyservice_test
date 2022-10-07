import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getNoteTreatisesByTreatiseId.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/users/getNoteTreatisesByTreatiseId', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .get('/users/getNoteTreatisesByTreatiseId')
      .query({ id: 'invalid id' });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not GET /users/getNoteTreatisesByTreatiseId with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/getNoteTreatisesByTreatiseId')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.user.user.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /users/getNoteTreatisesByTreatiseId', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/getNoteTreatisesByTreatiseId')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.noteTreatises[0].treatise.id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.noteTreatises).toBeTruthy();
    expect(result.body.data.noteTreatises.length).toBe(2);
  });
});
