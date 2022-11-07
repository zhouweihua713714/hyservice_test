import { Content_Types_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/homepage/getHomepageSearchResultByKeyword', () => {
  test('should get /homepage/getHomepageSearchResultByKeyword', async () => {
    const result = await request(tester.server).get('/homepage/getHomepageSearchResultByKeyword').query({
      keyword:'关键词'
    });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.keywords).toBeTruthy();
    expect(result.body.data.keywords.length).toBe(1);
  });
});
