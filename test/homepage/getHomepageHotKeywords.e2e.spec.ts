import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/homepage/getHomepageHotKeywords', () => {
  test('should get /homepage/getHomepageHotKeywords', async () => {
    const result = await request(tester.server).get('/homepage/getHomepageHotKeywords').query({
    });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.keywords).toBeTruthy();
    expect(result.body.data.keywords.length).toBe(2);
  });
});
