import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listTreatise.seed';

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
      .send({ keyword: '????????????;???????????????;????????????', page: 1, size: 2 });
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
        keyword: '????????????;??????;????????????',
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
  test('should POST /treatises/listComplexTreatise with startYear???endYear', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ startYear: 2001, endYear: 2022, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with topic', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ topic: '????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with childTopic', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ childTopic: '????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with goal', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ goal: '????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with object', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ object: '??????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with paradigm', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ paradigm: '????????????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with method', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ method: '??????', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(4);
  });
  test('should POST /treatises/listComplexTreatise with keyword case-insensitive', async () => {
    // make request
    const result = await request(tester.server)
      .post('/treatises/listComplexTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: 'aa', page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(3);
  });
});
