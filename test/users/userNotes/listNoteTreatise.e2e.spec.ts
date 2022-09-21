import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './listNoteTreatise.seed';
import { Content_Status_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/users/listNoteTreatise', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).get('/users/listNoteTreatise').query({});
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should GET /users/listNoteTreatise ', async () => {
    // make request
    const result = await request(tester.server)
      .get('/users/listNoteTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .query({
        page: 1,
        size: 2,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.noteTreatises).toBeTruthy();
    expect(result.body.data.noteTreatises.length).toBe(2);
    expect(result.body.data.count).toBe(2);
  });
});
