import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './listComplexAnalysisPolicy.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/policies/listComplexAnalysisPolicy', () => {
  test('should POST /policies/listComplexAnalysisPolicy with invalid columnId', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexAnalysisPolicy')
      .send({ columnId: tester.data.columns[0].id, page: 1, size: 2 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.analysisPolicies).toBeTruthy();
    expect(result.body.data.count).toBe(0);
  });
  test('should POST /policies/listComplexAnalysisPolicy with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listComplexAnalysisPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        page: 1,
        size: 3,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.analysisPolicies).toBeTruthy();
    expect(result.body.data.analysisPolicies.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
});
