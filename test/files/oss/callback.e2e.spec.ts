import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './access.seed';
import { v4 as uuidv4 } from 'uuid';
const tester = new DBTester<DataType>().setup();

// mock arguments
const headers_key_url = 'https://xxxx.ngrok.io/v1/version';
const base64 = (str: string) => Buffer.from(str).toString('base64');
const authorization = 'authorization_test';
describe('/files/oss/callback', () => {
  test('should not POST /file/callback with field id if have not been launched', async () => {
    // make request
    const result = await request(tester.server)
      .post('/file/callback')
      .set({
        'Content-Type': 'application/json',
        authorization,
        'x-oss-pub-key-url': base64(headers_key_url),
      })
      .send({
        file_id:uuidv4() ,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.NOT_FOUND);
  });

  test('should not POST /file/callback with field id', async () => {
    // 配置数据
    const ossBucket = tester.config.get<string>('oss.ossBucket');
    // 构造数据
    const body = {
      user_id: 'a',
      file_id: tester.data.file.id,
      bucket: ossBucket,
      object: 'a',
      etag: 'a',
      size: '123',
      mimeType: 'text/plain',
      imageInfo: {},
    };
    // make request
    const result = await request(tester.server)
      .post('/file/callback')
      .set({
        'Content-Type': 'application/json',
        authorization,
        'x-oss-pub-key-url': base64(headers_key_url),
      })
      .send(body);
    // use expect by jest
    expect(result.body).toBeTruthy();
    expect(result.body.file_id).toBeTruthy();
    expect(result.body.imageInfo).toBeTruthy();
    expect(result.body.status).toBeTruthy();
  });
});
