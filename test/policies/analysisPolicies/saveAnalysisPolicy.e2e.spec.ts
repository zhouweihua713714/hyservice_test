import { Content_Status_Enum, Education_Level_Enum } from '@/common/enums/common.enum';
import { constant } from '@/common/utils/constant';
import { SaveAnalysisPolicyDto } from '@/modules/policies/analysisPolicies/analysisPolicies.dto';

import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './saveAnalysisPolicy.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveAnalysisPolicyDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  title: '政策解读标题',
  columnId: 'tester.data.columns[1].id',
  source: '文章来源',
  announcedAt: new Date(),
  url: 'http://baidu.com',
  content: '正文',
};

describe('/policies/saveAnalysisPolicy', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/policies/saveAnalysisPolicy').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /policies/saveAnalysisPolicy with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/policies/saveAnalysisPolicy')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /policies/saveAnalysisPolicy with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/policies/saveAnalysisPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', title: '政策解读标题' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /policies/saveAnalysisPolicy with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/policies/saveAnalysisPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        title: '政策解读标题',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should POST /policies/saveAnalysisPolicy', async () => {
    payload.columnId = tester.data.columns[1].id;
    // save with
    const result = await request(tester.server)
      .post('/policies/saveAnalysisPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        title: '这是新增',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/policies/saveAnalysisPolicy')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
  });
});
