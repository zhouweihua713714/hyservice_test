import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './operateTerms.seed';

const tester = new DBTester<DataType>().setup();

describe('/terms/operateTerms', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/terms/operateTerms')
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /terms/operateTerms with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/terms/operateTerms')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should POST /terms/operateTerms with status is active', async () => {
    // save with
    const result = await request(tester.server)
      .post('/terms/operateTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.ACTIVE,
        ids: tester.data.terms.map((term) => {
          return term.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(2);
    expect(result.body.data.failed).toBe(0);
  });
  test('should POST /terms/operateTerms with status is ready', async () => {
    // save with
    const result = await request(tester.server)
      .post('/terms/operateTerms')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        ids: tester.data.terms.map((term) => {
          return term.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(0);
    expect(result.body.data.failed).toBe(2);
  });
});
