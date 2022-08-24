import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './operateTreatises.seed';

const tester = new DBTester<DataType>().setup();

describe('/treatises/operateTreatises', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/treatises/operateTreatises')
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /treatises/operateTreatises with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/treatises/operateTreatises')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should POST /treatises/operateTreatises with status is active', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/operateTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.ACTIVE,
        ids: tester.data.treatises.map((treatise) => {
          return treatise.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(2);
    expect(result.body.data.failed).toBe(1);
  });
  test('should POST /treatises/operateTreatises with status is ready', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/operateTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        ids: tester.data.treatises.map((treatise) => {
          return treatise.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(1);
    expect(result.body.data.failed).toBe(2);
  });
});
