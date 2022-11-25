import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getTreatiseLibraryDetail.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getTreatiseLibraryDetail', () => {
  test('should not GET /treatises/getTreatiseLibraryDetail with invalid id', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/getTreatiseLibraryDetail')
      .query({ id: 'invalid id' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should GET /treatises/getTreatiseLibraryDetail', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/getTreatiseLibraryDetail')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ id: tester.data.treatiseLibraryInfo.id, flag: true });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
  });
});
