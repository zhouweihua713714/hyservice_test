import { AppModule } from '@/app.module';
import { CodesRepo } from '@/entities/Codes.repo';
import { UsersRepo } from '@/entities/Users.repo';
import { AuthService } from '@/modules/auth/auth.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs';
import path from 'path';
import {
  Connection,
  createConnection,
  getConnectionOptions,
  QueryRunner,
} from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class DBTester<T> {
  app: INestApplication;
  module: TestingModule;
  authService: AuthService;
  codesRepository: CodesRepo;
  usersRepository: UsersRepo;
  server: any;

  data: T;

  private queryRunner: QueryRunner;
  private options: PostgresConnectionOptions;
  private connection: Connection;

  createSchema = async () => {
    this.options = (await getConnectionOptions()) as PostgresConnectionOptions;
    this.connection = await createConnection(this.options);
    this.queryRunner = this.connection.createQueryRunner();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.queryRunner.createSchema(this.options.schema!, true);
    await this.connection.synchronize();
  };

  setup() {
    beforeAll(async () => {
      await this.createSchema();

      this.module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      this.app = this.module.createNestApplication();
      await this.app.init();

      this.server = this.app.getHttpServer();

      this.authService = this.module.get<AuthService>(AuthService);
      this.codesRepository = this.module.get<CodesRepo>(CodesRepo);
      this.usersRepository = this.module.get<UsersRepo>(UsersRepo);
    ///
    ///
    });

    afterAll(async () => {
      this.app && (await this.app.close());
    });

    const dir = path.dirname(expect.getState().testPath);
    const testFile = path.basename(expect.getState().testPath);
    const potentialSeedFile = testFile.replace('e2e.spec.ts', 'seed.ts');

    if (fs.existsSync(path.join(dir, potentialSeedFile))) {
      const {
        seed: { up, down },
      } = require(path.join(dir, potentialSeedFile)); // eslint-disable-line @typescript-eslint/no-var-requires
      beforeEach(async () => {
        this.data = await up(this);
      });

      afterEach(async () => {
        await down(this);
      });
    }

    return this;
  }
}

export type TesterSeed<T = void> = {
  up: (tester: DBTester<T>) => Promise<T>;
  down: (tester: DBTester<T>) => Promise<void>;
};
