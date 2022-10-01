import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexInstitution.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/institutions/listComplexInstitution', () => {
  test('should POST /institutions/listComplexInstitution with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/institutions/listComplexInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '会议', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.institutions).toBeTruthy();
    expect(result.body.data.institutions.length).toBe(0);
    expect(result.body.data.count).toBe(0);
  });
  test('should POST /institutions/listComplexInstitution with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/institutions/listComplexInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '机构;关键词',
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.institutions).toBeTruthy();
    expect(result.body.data.institutions.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
});
