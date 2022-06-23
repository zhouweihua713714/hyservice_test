import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './access.seed';
import { encode } from '@/common/utils';
const tester = new DBTester<DataType>().setup();
describe('test/files/oss/launch.e2e.spec.ts', () => {
  test('should not POST /file/launch before login ', async () => {
    // make request
    const result = await await request(tester.server)
      .post('/file/launch')
      .send({ filename: '', uploadToken: '' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('should POST /file/launch after signUp', async () => {
    // make request
    const result = await request(tester.server)
      .post('/file/launch/')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ filename: '', uploadToken: '' });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
  });

  test('should POST /file/launch with uploadToken', async () => {
    const uploadToken = encode(
      JSON.stringify({
        id: tester.data.user.user.id,
        status: tester.data.user.user.status,
        timestamp: Date.now(),
      }),
      tester.config.get<string>('encode.secretKey') || '',
      tester.config.get<string>('encode.iv') || ''
    );
    // make request
    const result = await request(tester.server).post('/file/launch').send({
      filename: '233',
      uploadToken,
    });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.message).toBe('ok');
  });
});
