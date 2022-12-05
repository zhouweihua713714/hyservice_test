import { Channels_Enum, Content_Status_Enum, Peking_Unit_Enum } from '@/common/enums/common.enum';
import { SaveTreatiseLibraryDto } from '@/modules/treatises/treatiseLibrary/treatiseLibrary.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './saveTreatiseLibrary.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveTreatiseLibraryDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  title: '论文名称必填',
  columnId: 'tester.data.columns[1].id',
  field: '教育学',
  minorField: '教育学子领域;教育学子领域2',
  url: 'http://baidu.com',
  deliveryAt: new Date(),
  author: '第一作者',
  authorUnit: '第一作者单位',
  correspondingAuthor: '通讯作者',
  correspondingAuthorUnit: '通讯作者单位',
  correspondingAuthorEmail: '通讯作者邮箱',
  otherAuthor: '其他作者',
  otherAuthorUnit: '其他作者',
  sort: '文章类型需要赋值',
  abstract: '摘要不限制字数',
  keyword: '关键词',
  name: '期刊/会议名',
  magazineField: '杂志会议所属主领域',
  magazineMinorField: '杂志会议所属子领域',
};

describe('/treatises/saveTreatiseLibrary', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /treatises/saveTreatiseLibrary with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /treatises/saveTreatiseLibrary with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', title: '论文名称', sort: tester.data.sorts[0].id });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /treatises/saveTreatiseLibrary with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        title: '论文名称',
        sort: tester.data.sorts[0].id,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /treatises/saveTreatiseLibrary with invalid sort', async () => {
    const result = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[1].id,
        title: '论文名称',
        sort: 'invalid-id',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20020);
  });
  test('should POST /treatises/saveTreatiseLibrary', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.sort = tester.data.sorts[0].id;
    // save with
    const result = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        title: '这是新增',
        sort: payload.sort,
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/treatises/saveTreatiseLibrary')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.treatisesRepository.delete(result.body.data.id);
  });
});
