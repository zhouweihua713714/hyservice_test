import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { websiteRepository } from '@/modules/repository/repository';
import { DBTester } from '../testHelper';
import { DataType } from './setHomepage.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/homepage/getHomepageConfig', () => {
  test('should GET /homepage/getHomepageConfig', async () => {
    // save before get
    const resultData = await request(tester.server)
      .post('/homepage/setHomepage')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
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
      });
    expect(resultData.status).toBe(HttpStatus.OK);
    expect(resultData.body.code).toBe(200);
    expect(resultData.body.data.id).toBeTruthy();
    // make request
    const result = await request(tester.server).get('/homepage/getHomepageConfig').query({});
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.id).toBeTruthy();

    await websiteRepository.delete(resultData.body.data.id);
  });
});
