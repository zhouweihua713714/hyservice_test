import { Content_Types_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/configs/getSearchResultByKeyword', () => {
  test('should get /configs/getSearchResultByKeyword', async () => {
    const result = await request(tester.server).get('/configs/getSearchResultByKeyword').query({
      keyword: '项目关键词',
      type: Content_Types_Enum.CONFERENCE,
    });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.keywords).toBeTruthy();
    expect(result.body.data.keywords.length).toBe(0);
  });
  test('should get /configs/getSearchResultByKeyword', async () => {
    const result = await request(tester.server).get('/configs/getSearchResultByKeyword').query({
      keyword: '项目',
      type: Content_Types_Enum.TERM,
    });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.keywords).toBeTruthy();
    expect(result.body.data.keywords.length).toBe(2);
  });
});
