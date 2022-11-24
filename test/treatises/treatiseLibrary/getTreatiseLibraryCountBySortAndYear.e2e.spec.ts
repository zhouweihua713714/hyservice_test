import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getTreatiseLibraryCountBySortAndYear.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/treatises/getTreatiseLibraryCountBySortAndYear', () => {
  test('should GET /treatises/getTreatiseLibraryCountBySortAndYear', async () => {
    // make request
    const result = await request(tester.server).get('/treatises/getTreatiseLibraryCountBySortAndYear').query({ columnId: tester.data.columns[1].id });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.sortCounts).toBeTruthy();
    expect(result.body.data.yearCounts).toBeTruthy();
  });
});
