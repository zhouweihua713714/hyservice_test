import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { samples } from '../samples';
import { DBTester } from '../testHelper';
import { DataType } from './resetPassword.seed';
const tester = new DBTester<DataType>().setup();
const { mobile, password,code } = samples;
describe('/auth/resetPassword', () => {
  test('should not POST /auth/resetPassword without sending code', async () => {
    //delete code
    await tester.codesRepository.delete({ mobile });
    // make request
    const result = await request(tester.server)
      .post('/auth/resetPassword')
      .send({ mobile, code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10004);
  });
  test('should not POST /auth/resetPassword with wrong code', async () => {
    // make request
    const result = await request(tester.server)
      .post('/auth/resetPassword')
      .send({ mobile, code: 'error code', password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10006);
  });
  
  test('should not POST /auth/resetPassword with user not sign up', async () => {
    // make request
    const result = await request(tester.server)
      .post('/auth/resetPassword')
      .send({ mobile: '13012345670', code: code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10013);
  });
  test('should POST /auth/resetPassword and signIn with newPassword', async () => {
    // make request:resetPassword
    const result = await request(tester.server)
      .post('/auth/resetPassword')
      .send({ mobile, password, code });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    // make request:signIn
    const loginResult = await request(tester.server)
      .post('/auth/signIn')
      .send({ mobile, password, provider: '' });
    // use expect by jest
    expect(loginResult.status).toBe(HttpStatus.OK);
    expect(loginResult.body.code).toBe(200);
    expect(loginResult.body.message).toBe('ok');
    expect(loginResult.body.data.mobile).toBe(mobile);
  });
  test('should not POST /auth/resetPassword with expired code', async () => {
    //update code
    await tester.codesRepository.update(mobile, {
      sentAt: new Date(new Date().getTime() - 60000),
    });
    // make request
    const result = await request(tester.server)
      .post('/auth/resetPassword')
      .send({ mobile, code: 'error code', password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10005);
  });
});
