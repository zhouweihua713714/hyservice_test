import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './removeNoteTreatises.seed';

const tester = new DBTester<DataType>().setup();

describe('/users/removeNoteTreatises', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/users/removeNoteTreatises')
      .send({ ids: ['-1'], status: Content_Status_Enum.ACTIVE });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should POST /users/removeNoteTreatises', async () => {
    // save with
    const result = await request(tester.server)
      .post('/users/removeNoteTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.noteTreatises.map((noteTreatise) => {
          return noteTreatise.id;
        }),
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(2);
    expect(result.body.data.failed).toBe(0);
  });
});
