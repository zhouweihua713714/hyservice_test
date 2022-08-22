import { AppModule } from '@/app.module';
import { UsersDao } from '@/dao/users.dao';
import { AuthService } from '@/modules/auth/auth.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs';
import path from 'path';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '@/config';
import { Codes } from '@/entities/Codes.entity';
import { Users } from '@/entities/Users.entity';
import { Files } from '@/entities/Files.entity';
import { Logins } from '@/entities/Logins.entity';
import { Website } from '@/entities/Website.entity';
import { Columns } from '@/entities/Columns.entity';
import { TermTypes } from '@/entities/TermTypes.entity';
import { ReplaySubject } from 'rxjs';
import { Subjects } from '@/entities/Subjects.entity';
import { Terms } from '@/entities/Terms.entity';
import { Languages } from '@/entities/Languages.entity';
import { PeriodicalPeriods } from '@/entities/PeriodicalPeriods.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
import { Policies } from '@/entities/Policies.entity';
import { ArticleTypes } from '@/entities/ArticleTypes.entity';
import { Treatises } from '@/entities/Treatises.entity';
export class DBTester<T = undefined> {
  app: INestApplication;
  module: TestingModule;
  authService: AuthService;
  codesRepository: Repository<Codes>;
  usersRepository: Repository<Users>;
  usersDao: UsersDao;
  loginsRepository: Repository<Logins>;
  filesRepository: Repository<Files>;
  websiteRepository: Repository<Website>;
  columnsRepository: Repository<Columns>;
  termTypesRepository: Repository<TermTypes>;
  subjectsRepository: Repository<Subjects>;
  termsRepository: Repository<Terms>;
  languagesRepository: Repository<Languages>;
  periodicalPeriodsRepository: Repository<PeriodicalPeriods>;
  periodicalsRepository: Repository<Periodicals>;
  policyTypesRepository: Repository<PolicyTypes>;
  policiesRepository: Repository<Policies>;
  articleTypesRepository: Repository<ArticleTypes>;
  treatisesRepository: Repository<Treatises>;
  config: ConfigService;
  server: any;

  data: T;

  createSchema = async () => {
    const options = getConfig().postgres as PostgresConnectionOptions;
    this.dataSource = new DataSource(options);

    await this.dataSource.initialize();
    await this.dataSource.createQueryRunner().createSchema(options.schema, true);
    await this.dataSource.synchronize();
  };
  dataSource: any;

  setup() {
    beforeAll(async () => {
      await this.createSchema();

      this.module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      this.app = this.module.createNestApplication();
      await this.app.init();

      this.server = this.app.getHttpServer();

      this.config = this.module.get<ConfigService>(ConfigService);
      this.authService = this.module.get<AuthService>(AuthService);
      this.codesRepository = this.module.get<Repository<Codes>>(getRepositoryToken(Codes));
      this.usersRepository = this.module.get<Repository<Users>>(getRepositoryToken(Users));
      this.loginsRepository = this.module.get<Repository<Logins>>(getRepositoryToken(Logins));
      this.filesRepository = this.module.get<Repository<Files>>(getRepositoryToken(Files));
      this.websiteRepository = this.module.get<Repository<Website>>(getRepositoryToken(Website));
      this.columnsRepository = this.module.get<Repository<Columns>>(getRepositoryToken(Columns));
      this.termTypesRepository = this.module.get<Repository<TermTypes>>(
        getRepositoryToken(TermTypes)
      );
      this.subjectsRepository = this.module.get<Repository<Subjects>>(getRepositoryToken(Subjects));
      this.termsRepository = this.module.get<Repository<Terms>>(getRepositoryToken(Terms));
      this.languagesRepository = this.module.get<Repository<Languages>>(getRepositoryToken(Languages));
      this.periodicalPeriodsRepository = this.module.get<Repository<PeriodicalPeriods>>(getRepositoryToken(PeriodicalPeriods));
      this.periodicalsRepository = this.module.get<Repository<Periodicals>>(getRepositoryToken(Periodicals));
      this.policyTypesRepository = this.module.get<Repository<PolicyTypes>>(getRepositoryToken(PolicyTypes));
      this.policiesRepository = this.module.get<Repository<Policies>>(getRepositoryToken(Policies));
      this.articleTypesRepository =this.module.get<Repository<ArticleTypes>>(getRepositoryToken(ArticleTypes));
      this.treatisesRepository =this.module.get<Repository<Treatises>>(getRepositoryToken(Treatises));
      this.usersDao = this.module.get<UsersDao>(UsersDao);
    });

    afterAll(async () => {
      this.app && (await this.app.close());
      this.dataSource && (await this.dataSource.destroy());
    });

    const dir = path.dirname(expect.getState().testPath);
    const testFile = path.basename(expect.getState().testPath);
    const potentialSeedFile = testFile.replace('e2e.spec.ts', 'seed.ts');

    if (fs.existsSync(path.join(dir, potentialSeedFile))) {
      const {
        seed: { up, down },
      } = require(path.join(dir, potentialSeedFile)); // eslint-disable-line @typescript-eslint/no-var-requires
      up &&
        beforeEach(async () => {
          this.data = await up(this);
        });

      down &&
        afterEach(async () => {
          await down(this);
        });
    }

    return this;
  }
}

export type TesterSeed<T = void> = {
  up?: (tester: DBTester<T>) => Promise<T>;
  down?: (tester: DBTester<T>) => Promise<void>;
};
