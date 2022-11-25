import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './recommendTreatiseLibraries.seed';

const tester = new DBTester<DataType>().setup();

describe('/treatises/recommendTreatiseLibraries', () => {
  test('should POST /treatises/recommendTreatiseLibraries with invalid params', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/recommendTreatiseLibraries')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatiseLibraries).toBeTruthy;
    expect(result.body.data.treatiseLibraries.length).toBe(0);
  });
  test('should POST /treatises/recommendTreatiseLibraries', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/recommendTreatiseLibraries')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.treatiseLibraries[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatiseLibraries).toBeTruthy;
    expect(result.body.data.treatiseLibraries.length).toBe(8);
  });
});
