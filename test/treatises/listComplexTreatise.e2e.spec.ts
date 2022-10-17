import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listTreatise.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/listComplexTreatise', () => {
  test('should POST /treatises/listComplexTreatise with columnId', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /treatises/listComplexTreatise with deliveryAt', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ deliveryAt: new Date(), page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /treatises/listComplexTreatise with releasedAt', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ releasedAt: new Date(), page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(1);
    expect(result.body.data.count).toBe(1);
  });
  test('should POST /treatises/listComplexTreatise with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: '论文匹配;关键词匹配;摘要匹配', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /treatises/listComplexTreatise with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        keyword: '论文匹配;关键;摘要匹配',
        columnId: tester.data.columns[1].id,
        deliveryAt: new Date(),
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
});
