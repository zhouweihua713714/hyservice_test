import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listComplexConference.seed';
import { Picker_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/conferences/listComplexConference', () => {
  test('should POST /conferences/listComplexConference with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/conferences/listComplexConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '多关键词匹配;会议', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /conferences/listComplexConference with pick is year', async () => {
    // make request
    const result = await request(tester.server)
      .post('/conferences/listComplexConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ conductedAt: new Date(), picker: Picker_Enum.Year, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /conferences/listComplexConference with pick is month', async () => {
    // make request
    const result = await request(tester.server)
      .post('/conferences/listComplexConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ conductedAt: new Date(), picker: Picker_Enum.Month, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /conferences/listComplexConference with pick is date', async () => {
    // make request
    const result = await request(tester.server)
      .post('/conferences/listComplexConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        conductedAt: new Date(new Date().getTime() - 50000),
        endedAt: new Date(),
        picker: Picker_Enum.Date,
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /conferences/listComplexConference with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/conferences/listComplexConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '多关键词匹配;会议',
        conductedAt: new Date(new Date().getTime() - 50000),
        endedAt: new Date(),
        picker: Picker_Enum.Date,
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.conferences).toBeTruthy();
    expect(result.body.data.conferences.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
});
