import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { samples } from '../samples';
import { DBTester } from '../testHelper';
import { DataType } from './modifyPassword.seed';

const tester = new DBTester<DataType>().setup();
const { mobile, oldPassword, newPassword } = samples;

describe('/auth/modifyPassword', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/auth/modifyPassword')
      .send({ mobile, oldPassword, newPassword });

    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST with incorrect oldPassword', async () => {
    const result = await request(tester.server)
      .post('/auth/modifyPassword')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ mobile, oldPassword: 'error password', newPassword });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10009);
  });
  test('should not POST /auth/modify_password with identical passwords', async () => {
    const result = await request(tester.server)
      .post('/auth/modifyPassword')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ mobile, oldPassword, newPassword: oldPassword });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10008);
  });

  test('should POST and signIn with newPassword', async () => {
    const result = await request(tester.server)
      .post('/auth/modifyPassword')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ mobile, oldPassword, newPassword });

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');

    const loginResult = await request(tester.server)
      .post('/auth/signIn')
      .send({ mobile, password: newPassword, provider: 'local' });
    expect(loginResult.status).toBe(HttpStatus.OK);
    expect(loginResult.body.code).toBe(200);
    expect(loginResult.body.message).toBe('ok');
    expect(loginResult.body.data.mobile).toBe(mobile);
  });
});
