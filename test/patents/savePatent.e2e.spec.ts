import { Content_Status_Enum } from '@/common/enums/common.enum';
import { SavePatentDto } from '@/modules/patents/patents.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './savePatent.seed';

const tester = new DBTester<DataType>().setup();
const payload: SavePatentDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  title: '专利标题名称必填',
  columnId: 'tester.data.columns[1].id',
  type: 'tester.data.patentType.id',
  abstract: '摘要',
  applicant: '申请人',
  announcedNo: '公开号',
  announcedAt: new Date(),
  appliedAt: new Date(),
  appliedNo: '申请号',
  country: '中国',
  agency: '代理机构',
  agent: '代理人',
  validStatus: '专利有效性需要赋值',
  keyword: '关键字',
};

describe('/patents/savePatent', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/patents/savePatent').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /patents/savePatent with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /patents/savePatent with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', type: tester.data.patentType.id, title: '专利名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /patents/savePatent with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        type: tester.data.patentType.id,
        title: '专利名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /patents/savePatent with invalid type', async () => {
    const result = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, type: 'invalid id', title: '专利名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20002);
  });
  test('should not POST /patents/savePatent with invalid validStatus', async () => {
    const result = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        validStatus: 'invalid id',
        columnId: tester.data.columns[1].id,
        type: tester.data.patentType.id,
        title: '专利名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20014);
  });
  test('should POST /patents/savePatent', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.type = tester.data.patentType.id;
    payload.validStatus = tester.data.patentValidType.id;
    // save with
    const result = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        type: payload.type,
        title: '这是新增',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/patents/savePatent')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.patentsRepository.delete(result.body.data.id);
  });
});
