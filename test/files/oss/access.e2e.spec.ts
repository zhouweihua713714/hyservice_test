import request from 'supertest';
import { DBTester } from '../../testHelper';
import { DataType } from './access.seed';
const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/files/oss/access', () => {
  test('should GET /file/access with field id', async () => {
    // 获取配置数据
    const ossBucket = tester.config.get<string>('oss.ossBucket');
    const ossRegion = tester.config.get<string>('oss.ossRegion');
    // make request
    const result = await request(tester.server)
      .get('/file/access')
      .query({ file_id: tester.data.file.id });
    // use expect by jest
    expect(result.redirect).toBe(true);
    expect(result.statusCode).toBe(302);
    expect(
      result.text.includes(`http://${ossBucket}.${ossRegion}.aliyuncs.com/${tester.data.file.id}`)
    ).toBe(true);
  });
});
