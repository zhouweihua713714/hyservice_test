import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { DBTester } from '../../testHelper';
import { DataType } from './listComplexAmericaTerm.seed';
import { NSFDirectorate_Enum } from '@/common/enums/common.enum';

const tester = new DBTester<DataType>().setup();

// mock arguments
describe('/terms/listComplexAmericaTerm', () => {
  test('should POST /terms/listComplexAmericaTerm with year', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexAmericaTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ year: new Date(), page: 1, size: 10 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms).toBeTruthy();
    expect(result.body.data.americaTerms.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /terms/listComplexAmericaTerm with organization', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexAmericaTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ organization: 'University of Maryland,College Park', page: 1, size: 10 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms).toBeTruthy();
    expect(result.body.data.americaTerms.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /terms/listComplexAmericaTerm with principalInvestigator', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexAmericaTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ principalInvestigator: 'Lloyd Slevc', page: 1, size: 10 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms).toBeTruthy();
    expect(result.body.data.americaTerms.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });
  test('should POST /terms/listComplexAmericaTerm with keyword', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexAmericaTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ keyword: 'keyword', page: 1, size: 10 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms).toBeTruthy();
    expect(result.body.data.americaTerms.length).toBe(3);
    expect(result.body.data.count).toBe(3);
  });

  test('should POST /terms/listComplexAmericaTerm with nsfDirectorate', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexAmericaTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({ nsfDirectorate: NSFDirectorate_Enum.NSFDirectorate_SBE, page: 1, size: 10 });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms).toBeTruthy();
    expect(result.body.data.americaTerms.length).toBe(1);
    expect(result.body.data.count).toBe(1);
  });
  test('should POST /terms/listComplexAmericaTerm with all condition', async () => {
    // make request
    const result = await request(tester.server)
      .post('/terms/listComplexAmericaTerm')
      .set('Authorization', tester.data.user.headers.authorization)
      .send({
        year: new Date(),       
        keyword: 'Keyword',
        nsfDirectorate: NSFDirectorate_Enum.NSFDirectorate_SBE,
        organization: 'University of Maryland,College Park',
        principalInvestigator: 'Lloyd Slevc',
        page: 1,
        size: 10,
      });
    // use expect by jest
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(200);
    expect(result.body.data.americaTerms).toBeTruthy();
    expect(result.body.data.americaTerms.length).toBe(1);
    expect(result.body.data.count).toBe(1);
  });
});
