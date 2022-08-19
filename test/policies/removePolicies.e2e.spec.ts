import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './removePolicies.seed';

const tester = new DBTester<DataType>().setup();

describe('/policies/removePolicies', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/policies/removePolicies')
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /policies/removePolicies with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/policies/removePolicies')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should POST /policies/removePolicies', async () => {
    // save with
    const result = await request(tester.server)
      .post('/policies/removePolicies')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.policies.map((policy) => {
          return policy.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(3);
    expect(result.body.data.failed).toBe(0);
  });
});
