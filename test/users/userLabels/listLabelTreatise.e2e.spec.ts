import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './listLabelTreatise.seed';
import { Labels_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/users/listLabelTreatise', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).get('/users/listLabelTreatise').query({});
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should GET /users/listLabelTreatise with label', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/listLabelTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({
        label: Labels_Enum.Label_002,
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.labelTreatises).toBeTruthy();
    expect(result.body.data.labelTreatises.length).toBe(0);
    expect(result.body.data.count).toBe(0);
  });
  test('should GET /users/listLabelTreatise with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/listLabelTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({
        flag: true,
        label: Labels_Enum.Label_001,
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.labelTreatises).toBeTruthy();
    expect(result.body.data.labels).toBeTruthy();
    expect(result.body.data.labelTreatises.length).toBe(2);
    expect(result.body.data.labels.length).toBe(1);
    expect(result.body.data.count).toBe(3);
  });
});
