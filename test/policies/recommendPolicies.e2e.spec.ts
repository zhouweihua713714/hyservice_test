import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './recommendPolicies.seed';

const tester = new DBTester<DataType>().setup();

describe('/policies/recommendPolicies', () => {
  test('should POST /policies/recommendPolicies with invalid id', async () => {
    // save with
    const result = await request(tester.server)
      .post('/policies/recommendPolicies')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(9);
  });
  test('should POST /policies/recommendPolicies', async () => {
    // save with
    const result = await request(tester.server)
      .post('/policies/recommendPolicies')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.policies[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.policies).toBeTruthy();
    expect(result.body.data.policies.length).toBe(9);
  });
});
