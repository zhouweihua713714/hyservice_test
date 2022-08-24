import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './removeTreatises.seed';

const tester = new DBTester<DataType>().setup();

describe('/treatises/removeTreatises', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/treatises/removeTreatises')
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /treatises/removeTreatises with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/treatises/removeTreatises')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should POST /treatises/removeTreatises', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/removeTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.treatises.map((treatise) => {
          return treatise.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(3);
    expect(result.body.data.failed).toBe(0);
  });
});
