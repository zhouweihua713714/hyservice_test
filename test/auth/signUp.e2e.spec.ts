import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { samples } from '../samples';
import { DBTester } from '../testHelper';
import { DataType } from './signUp.seed';
const tester = new DBTester<DataType>().setup();
const { mobile,password, code } = samples;
describe('/auth/signUp', () => {
  test('should not POST /auth/signUp without valid information', async () => {
    //delete code
    await tester.codesRepository.delete({ mobile });
    // make request
    const result = await  request(tester.server)
      .post('/auth/signUp')
      .send({ mobile: 'mobile', code: 'code', password: 'password' });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10003);
  });
  test('should not POST /auth/signUp without sending code', async () => {
    //delete code
    await tester.codesRepository.delete({ mobile: mobile });
    // make request
    const result = await  request(tester.server)
      .post('/auth/signUp')
      .send({ mobile, code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10004);
  });
  test('should not POST /auth/signUp with expired code', async () => {
    //update code
    await tester.codesRepository.update(mobile, {
      sentAt: new Date(new Date().getTime() - 60000),
    });
    // make request
    const result = await  request(tester.server)
      .post('/auth/signUp')
      .send({ mobile, code: code, password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10005);
  });
  test('should not POST /auth/signUp with wrong code', async () => {
    //update code
    await tester.codesRepository.update(mobile, {
      sentAt: new Date(new Date().getTime() - 60000),
    });
    // make request
    const result = await  request(tester.server)
      .post('/auth/signUp')
      .send({ mobile, code: '111111', password });
    //use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10005);
  });
  test('should POST /auth/signUp', async () => {
    // make request
    const result = await  request(tester.server)
      .post('/auth/signUp')
      .send({ mobile, password, code });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.mobile).toBe(mobile);
    await tester.usersRepository.delete({ mobile });
  });
});
