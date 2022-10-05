import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './recommendAnalysisPolicies.seed';

const tester = new DBTester<DataType>().setup();

describe('/policies/recommendAnalysisPolicies', () => {
  test('should POST /policies/recommendAnalysisPolicies with invalid id', async () => {
    // save with
    const result = await request(tester.server)
      .post('/policies/recommendAnalysisPolicies')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.analysisPolicies).toBeTruthy();
    expect(result.body.data.analysisPolicies.length).toBe(5);
  });
  test('should POST /policies/recommendAnalysisPolicies', async () => {
    // save with
    const result = await request(tester.server)
      .post('/policies/recommendAnalysisPolicies')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.analysisPolicies[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.analysisPolicies).toBeTruthy();
    expect(result.body.data.analysisPolicies.length).toBe(5);
  });
});
