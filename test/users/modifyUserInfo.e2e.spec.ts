import { Content_Status_Enum } from '@/common/enums/common.enum';
import { SaveTermDto } from '@/modules/terms/terms.dto';
import { ModifyUserInfoDto } from '@/modules/users/users.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './modifyUserInfo.seed';

const tester = new DBTester<DataType>().setup();
const payload: ModifyUserInfoDto = {
  id: '有传id则为编辑无则新增',
  avatar: '用户头像',
  university: '需要赋值',
};

describe('/users/modifyUserInfo', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/users/modifyUserInfo').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /users/modifyUserInfo with illegal user id', async () => {
    const result = await request(tester.server)
      .post('/users/modifyUserInfo')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ id: 'invalid id' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(40001);
  });
  test('should not POST /users/modifyUserInfo with invalid university', async () => {
    const result = await request(tester.server)
      .post('/users/modifyUserInfo')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ id: tester.data.user.user.id, university: 'invalid id' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20017);
  });
  test('should POST /users/modifyUserInfo', async () => {
    payload.university = tester.data.universityInfo.id;
    payload.id = tester.data.user.user.id;
    // save with
    const result = await request(tester.server)
      .post('/users/modifyUserInfo')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
  });
});
