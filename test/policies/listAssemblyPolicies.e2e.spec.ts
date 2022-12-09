import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../testHelper';
import { DataType } from './listAssemblyPolicies.seed';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/policies/listAssemblyPolicies', () => {
  test('should POST /policies/listAssemblyPolicies', async () => {
    // make request
    const result = await request(tester.server)
      .post('/policies/listAssemblyPolicies')
      .send({ page: 1, size: 2 });

    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.assemblyPolicies).toBeTruthy();
    expect(result.body.data.count).toBe(1);
  });
});
