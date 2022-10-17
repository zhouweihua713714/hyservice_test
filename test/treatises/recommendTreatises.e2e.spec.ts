import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './recommendTreatises.seed';

const tester = new DBTester<DataType>().setup();

describe('/treatises/recommendTreatises', () => {
  test('should POST /treatises/recommendTreatises with invalid params', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/recommendTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy;
    expect(result.body.data.treatises.length).toBe(0);
  });
  test('should POST /treatises/recommendTreatises', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/recommendTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.treatises[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy;
    expect(result.body.data.treatises.length).toBe(7);
  });
});
