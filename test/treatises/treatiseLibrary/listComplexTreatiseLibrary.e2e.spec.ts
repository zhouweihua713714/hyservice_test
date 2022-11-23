import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './listComplexTreatiseLibrary.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/listComplexTreatiseLibrary', () => {
  test('should POST /treatises/listComplexTreatiseLibrary with columnId', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatiseLibraries).toBeTruthy();
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /treatises/listComplexTreatiseLibrary with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '论文匹配;关键词匹配;摘要匹配', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatiseLibraries).toBeTruthy();
    expect(result.body.data.treatiseLibraries.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /treatises/listComplexTreatiseLibrary with sort', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ sort: tester.data.sorts[0].id, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatiseLibraries).toBeTruthy();
    expect(result.body.data.treatiseLibraries.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
  test('should POST /treatises/listComplexTreatiseLibrary with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '论文匹配;关键;摘要匹配',
        columnId: tester.data.columns[1].id,
        sort: tester.data.sorts[0].id,
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatiseLibraries).toBeTruthy();
    expect(result.body.data.treatiseLibraries.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
});
