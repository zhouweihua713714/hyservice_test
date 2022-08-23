import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listTreatise.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/listTreatise', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).get('/treatises/listTreatise').query({});
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not GET /treatises/listTreatise with user is not admin', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/listTreatise')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should GET /treatises/listTreatise with invalid columnId', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/listTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ columnId: tester.data.columns[0].id, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.count).toBe(0);
  });
  test('should GET /treatises/listTreatise with status', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/listTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ status: Content_Status_Enum.READY, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
  test('should GET /treatises/listTreatise with name', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/listTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({ title: '论文', page: 1, size: 3});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
  test('should GET /treatises/listTreatise with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .get('/treatises/listTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({
        title: '论文',
        status: Content_Status_Enum.READY,
        columnId: tester.data.columns[1].id,
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.treatises).toBeTruthy();
    expect(result.body.data.treatises.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
});
