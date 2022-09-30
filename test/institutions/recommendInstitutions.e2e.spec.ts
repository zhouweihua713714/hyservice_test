import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './recommendInstitutions.seed';

const tester = new DBTester<DataType>().setup();

describe('/institutions/recommendInstitutions', () => {
  test('should POST /institutions/recommendInstitutions with invalid id', async () => {
    // save with
    const result = await request(tester.server)
      .post('/institutions/recommendInstitutions')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: 'invalid id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.institutions).toBeTruthy();
    expect(result.body.data.institutions.length).toBe(8);
  });
  test('should POST /institutions/recommendInstitutions', async () => {
    // save with
    const result = await request(tester.server)
      .post('/institutions/recommendInstitutions')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        id: tester.data.institutions[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.institutions).toBeTruthy();
    expect(result.body.data.institutions.length).toBe(8);
  });
});
