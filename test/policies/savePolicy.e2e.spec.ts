import { Content_Status_Enum, Education_Level_Enum } from '@/common/enums/common.enum';
import { constant } from '@/common/utils/constant';
import { SavePolicyDto } from '@/modules/policies/policies.dto';

import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './savePolicy.seed';

const tester = new DBTester<DataType>().setup();
const payload: SavePolicyDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  name: '政策名称必填',
  columnId: 'tester.data.columns[1].id',
  type: 'tester.data.policyType.id',
  announceNo: '发文号',
  level: constant.POLICY_LEVEL,
  institution: '机构名称',
  educationLevel: [Education_Level_Enum.BASIC, Education_Level_Enum.HIGHER],
  keyword: '关键字;政策',
  announcedAt: new Date(),
  introduction: '简介最多300',
  region: '中国',
  url: 'http://baidu.com',
};

describe('/policies/savePolicy', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/policies/savePolicy').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /policies/savePolicy with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /policies/savePolicy with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', type: tester.data.policyType.id, name: '政策名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /policies/savePolicy with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        type: tester.data.policyType.id,
        name: '政策名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /policies/savePolicy with invalid type', async () => {
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, type: 'invalid id', name: '政策名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20002);
  });
  test('should not POST /policies/savePolicy with invalid education level', async () => {
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, educationLevel:['invalid'], name: '政策名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20009);
  });
  test('should not POST /policies/savePolicy with invalid  level', async () => {
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, level:'invalid id', name: '政策名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20010);
  });
  test('should POST /policies/savePolicy', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.type = tester.data.policyType.id;
    // save with
    const result = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        type: payload.type,
        name: '这是新增',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/policies/savePolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.policiesRepository.delete(result.body.data.id);
  });
});
