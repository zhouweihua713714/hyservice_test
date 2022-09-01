import { Content_Status_Enum, Peking_Unit_Enum } from '@/common/enums/common.enum';
import { SaveConferenceDto } from '@/modules/conferences/conferences.dto';
import { SaveInstitutionDto } from '@/modules/institutions/institutions.dto';
import { HttpStatus } from '@nestjs/common';
import { words } from 'lodash';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './saveInstitution.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveInstitutionDto = {
  id: '有传id则为编辑无则新增',
  status: Content_Status_Enum.ACTIVE,
  name: '机构名称必填',
  columnId: 'tester.data.columns[1].id',
  foreignName: 'China',
  address:'详细地址',
  introduction:'简介',
  unit:'主办单位',
  field:[],
  minorField:[],
  longitude:114.356830,
  latitude:30.506257,
  url:'图片链接',
  website:'http://baidu.com'
};

describe('/institutions/saveInstitution', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/institutions/saveInstitution').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /institutions/saveInstitution with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/institutions/saveInstitution')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });
  test('should not POST /institutions/saveInstitution with invalid columnId', async () => {
    const result = await request(tester.server)
      .post('/institutions/saveInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: 'invalid id', name: '机构名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /institutions/saveInstitution with illegal columnId', async () => {
    const result = await request(tester.server)
      .post('/institutions/saveInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        columnId: tester.data.columns[0].id,
        name: '机构名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20001);
  });
  test('should not POST /institutions/saveInstitution with invalid field', async () => {
    const result = await request(tester.server)
      .post('/institutions/saveInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ columnId: tester.data.columns[1].id, field: ['invalid id'], name: '机构名称' });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20015);
  });
  test('should not POST /institutions/saveInstitution with invalid minorField', async () => {
    const result = await request(tester.server)
      .post('/institutions/saveInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        minorField: ['invalid id'],
        columnId: tester.data.columns[1].id,
        name: '机构名称',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20016);
  });
  test('should POST /institutions/saveInstitution', async () => {
    payload.columnId = tester.data.columns[1].id;
    payload.field = [tester.data.fields[0].id];
    payload.minorField = [tester.data.fields[1].id];
    // save with
    const result = await request(tester.server)
      .post('/institutions/saveInstitution')
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
      .post('/institutions/saveInstitution')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.conferencesRepository.delete(result.body.data.id);
  });
});
