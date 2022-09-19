import { Content_Status_Enum, Labels_Enum, Operate_types_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './operateLabelTreatises.seed';

const tester = new DBTester<DataType>().setup();

describe('/users/operateLabelTreatises', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/users/operateLabelTreatises')
      .send({ ids: ['-1'] });
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });

  test('should POST /users/operateLabelTreatises with type is add', async () => {
    // save with
    const result = await request(tester.server)
      .post('/users/operateLabelTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.treatises.map((treatise) => {
          return treatise.id;
        }),
        type: Operate_types_Enum.Add,
        label:Labels_Enum.Label_001
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(3);
    expect(result.body.data.failed).toBe(0);
  });
  test('should POST /users/operateLabelTreatises with type is remove', async () => {
    // save with
    const result = await request(tester.server)
      .post('/users/operateLabelTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        ids: tester.data.treatises.map((treatise) => {
          return treatise.id;
        }),
        type: Operate_types_Enum.Remove,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.succeed).toBe(0);
    expect(result.body.data.failed).toBe(3);
  });
});
