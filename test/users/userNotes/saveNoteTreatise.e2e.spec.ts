import { Channels_Enum, Content_Status_Enum, Peking_Unit_Enum } from '@/common/enums/common.enum';
import { SaveNoteTreatiseDto } from '@/modules/users/userNotes/userNotes.dto';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './saveNoteTreatise.seed';

const tester = new DBTester<DataType>().setup();
const payload: SaveNoteTreatiseDto = {
  id: '有传id则为编辑无则新增',
  content: '笔记内容',
  comment: '笔记评论',
  treatiseId: '论文id需要赋值',
};

describe('/users/saveNoteTreatise', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/users/saveNoteTreatise').send(payload);
    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('should not POST /users/saveNoteTreatise with invalid treatiseId', async () => {
    const result = await request(tester.server)
      .post('/users/saveNoteTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        treatiseId: 'invalid id',
        content: '笔记内容',
        comment: '笔记评论',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(20005);
  });
  test('should POST /users/saveNoteTreatise', async () => {
    payload.treatiseId = tester.data.treatiseInfo.id;
    // save with
    const result = await request(tester.server)
      .post('/users/saveNoteTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        treatiseId: tester.data.treatiseInfo.id,
        content: '笔记内容',
      });
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    //save with id
    payload.id = result.body.data.id;
    const resultData = await request(tester.server)
      .post('/users/saveNoteTreatise')
      .set('Authorization', tester.data.user.headers.authorization)
      .send(payload);
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
  });
});
