import { User_Types_Enum } from '@/common/enums/common.enum';
import { SetHomepageDto } from '@/modules/homepage/homepage.dto';
import { HttpStatus } from '@nestjs/common';
import { Console } from 'console';
import request from 'supertest';
import { DBTester } from '../testHelper';
import { DataType } from './setHomepage.seed';

const tester = new DBTester<DataType>().setup();
const payload: SetHomepageDto = {
  id: '需要赋值',
  name: '网站名称',
  IPC: '备案号',
  CDN: 'xxxx',
  versionNo: '版本号',
  blacklist: '123.123.123.123',
  title: '网站标题必填',
  description: '网站描述非必填',
  ownership: '版权所有',
  bottomDescription: '底部描述必填',
  links: [{ url: 'www.baidu.com', title: '友情链接标题' }],
  logo: 'http://xxxx.png',
  qrCode: '二维码',
};

describe('/homepage/setHomepage', () => {
  test('should not POST before login', async () => {
    const result = await request(tester.server).post('/homepage/setHomepage').send(payload);

    expect(result.status).toBe(HttpStatus.FORBIDDEN);
  });

  test('should not POST /homepage/setHomepage with user is not admin', async () => {
    const result = await request(tester.server)
      .post('/homepage/setHomepage')
      .set('Authorization', tester.data.normalUser.headers.authorization)
      .send(payload);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(10016);
  });

  test('should not POST /homepage/setHomepage', async () => {
    // save without id
    const result = await request(tester.server)
      .post('/homepage/setHomepage')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({});
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();
    payload.id = result.body.data.id;
    // save with id
    const resultData = await request(tester.server)
      .post('/homepage/setHomepage')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ ...payload });
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    await tester.websiteRepository.delete(result.body.data.id);
  });
});
