import { Content_Status_Enum } from '@/common/enums/common.enum';
import { SaveConferenceDto } from '@/modules/conferences/conferences.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './saveConference.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveConferenceDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  name: '会议名称必填',
  columnId: 'tester.data.columns[1].id',
  abbreviation: '会议缩写',
  conductedAt: new Date(),
  endedAt: new Date(),
  period: 1,
  location: '中国',
  introduction: '简介',
  coverUrl: '封面链接',
  field: [],
  minorField: [],
  website: 'http://baidu.com',
  contact: '联络人',
  email: '邮箱',
  unit: '举办单位',
  deliveryEndedAt: new Date(),
  preregisterEndedAt: new Date(),
  registerEndedAt: new Date(),
  picker: 'date',
  parentId: '0',
};

describe('/conferences/saveConference', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/conferences/saveConference').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /conferences/saveConference with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /conferences/saveConference with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', name: '会议名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /conferences/saveConference with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        name: '会议名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /conferences/saveConference with invalid field', async () => {
    const result = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, field: ['invalid id'], name: '会议名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20015);
  });
  test('should not POST /conferences/saveConference with invalid minorField', async () => {
    const result = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        minorField: ['invalid id'],
        columnId: tester.data.columns[1].id,
        name: '会议名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20016);
  });
  test('should POST /conferences/saveConference', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.field = [tester.data.fields[0].id];
    payload.minorField = [tester.data.fields[1].id];
    // save with
    const result = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        status: Content_Status_Enum.READY,
        columnId: payload.columnId,
        name: '这是新增',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/conferences/saveConference')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.conferencesRepository.delete(result.body.data.id);
  });
});
