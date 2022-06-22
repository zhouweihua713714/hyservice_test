import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe.skip('test/controller/app.e2e-spec.ts', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  test('should GET /healthy', () => {
    return request(app.getHttpServer()).get('/healthy').expect(200).expect('healthy');
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
