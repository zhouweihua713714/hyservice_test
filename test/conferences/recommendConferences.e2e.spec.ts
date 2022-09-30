import { Content_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './recommendConferences.seed';

const tester = new DBTester<DataType>().setup();

describe('/conferences/recommendConferences', () => {
  test('should POST /conferences/recommendConferences with invalid id', async () => {
    // save with
    const result = await request(tester.server)
      .post('/conferences/recommendConferences')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(8);
  });
  test('should POST /conferences/recommendConferences', async () => {
    // save with
    const result = await request(tester.server)
      .post('/conferences/recommendConferences')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.conferences[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(8);
  });
});
