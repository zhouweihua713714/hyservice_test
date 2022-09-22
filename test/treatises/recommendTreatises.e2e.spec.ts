import { Content_Status_Enum } from '@/common/enums/common.enum';
import dataSource from '@/dataSource';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './removeTreatises.seed';

const tester = new DBTester<DataType>().setup();

describe('/treatises/recommendTreatises', () => {
  test('should POST /treatises/recommendTreatises with invalid params', async () => {
    // save with
    const result = await request(tester.server)
      .post('/treatises/recommendTreatises')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: 'invalid',
        columnId: 'invalid',
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
        keyword: '关键词;关键词匹配',
        columnId: tester.data.columns[1].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy;
    expect(result.body.data.treatises.length).toBe(8);
  });
});
