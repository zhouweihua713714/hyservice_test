import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './getAmericaTermAmountByKeywords.seed';
import { NSFDirectorate_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/getAmericaTermAmountByKeywords', () => {
  test('should GET /terms/getAmericaTermAmountByKeywords', async () => {
    // make request
    const result = await request(tester.server)
      .get('/terms/getAmericaTermAmountByKeywords')
      .query({nsfDirectorate: NSFDirectorate_Enum.NSFDirectorate_CSE});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms[0].amount).toBeTruthy();
  });
});
