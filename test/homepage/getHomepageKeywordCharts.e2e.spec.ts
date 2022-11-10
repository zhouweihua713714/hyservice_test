import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/homepage/getHomepageKeywordCharts', () => {
  test('should get /homepage/getHomepageKeywordCharts', async () => {
    const result = await request(tester.server).get('/homepage/getHomepageKeywordCharts').query({
      keyword:'关键词'
    });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.termColumns).toBeTruthy();
    expect(result.body.data.treatiseColumns).toBeTruthy();
    expect(result.body.data.termColumns.length).toBe(2);
    expect(result.body.data.treatiseColumns.length).toBe(1);
  });
});
