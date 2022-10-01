import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './removeAnalysisPolicies.seed';

const tester = new DBTester<DataType>().setup();

describe('/policies/removeAnalysisPolicies', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/policies/removeAnalysisPolicies')
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /policies/removeAnalysisPolicies with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/policies/removeAnalysisPolicies')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should POST /policies/removeAnalysisPolicies', async () => {
    // save with
    const result = await request(tester.server)
      .post('/policies/removeAnalysisPolicies')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.analysisPolicies.map((policy) => {
          return policy.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(3);
    expect(result.body.data.failed).toBe(0);
  });
});
