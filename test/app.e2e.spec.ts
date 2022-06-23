import request from 'supertest';
import { DBTester } from './testHelper';
const tester = new DBTester().setup();

describe('app', () => {
  test('should GET /healthy', () => {
    return request(tester.server).get('/healthy').expect(200).expect('healthy');
  });
});
