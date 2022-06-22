import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';

const tester = new DBTester().setup();

describe('/auth/gen_code', () => {
  const mobile = '18000000000';

  test('should POST', async () => {
    const result = await request(tester.server).post('/auth/gen_code').send({ mobile });
    
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.mobile).toBe(mobile);
  });
});
