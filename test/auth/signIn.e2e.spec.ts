import { User_Status_Enum } from '@/common/enums/common.enum';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { samples } from '../samples';
import { DBTester } from '../testHelper';
import { DataType } from './signIn.seed';
const tester = new DBTester<DataType>().setup();
const { mobile, password} = samples;
describe('test/auth/signIn.e2e.spec.ts', () => {
  test('should not POST /auth/signIn if mobile not found', async () => {
    // make request
    const result = await request(tester.server)
      .post('/auth/signIn')
      .send({ mobile: '13900000001', password: 'error password' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10017);
  });
  test('should not POST /auth/signIn with incorrect password', async () => {
    // make request
    const result = await request(tester.server)
      .post('/auth/signIn')
      .send({ mobile, password: 'error password' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10018);
  });
  test('should POST /auth/signIn by correct mobile and password', async () => {
    // make request
    const result = await request(tester.server)
      .post('/auth/signIn')
      .send({ mobile, password });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
    expect(result.body.data.mobile).toBe(mobile);
  });
  test('should not POST /auth/signIn if account is disabled', async () => {
    // update user
    await tester.usersRepository.update(tester.data.user.user.id, {
      status:  User_Status_Enum.Disabled,
    });
    // make request
    const result = await request(tester.server)
      .post('/auth/signIn')
      .send({ mobile, password });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10012);
  });
});
