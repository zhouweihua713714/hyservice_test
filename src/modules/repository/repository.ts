import DataSource from '@/dataSource';
import { ArticleTypes } from '@/entities/ArticleTypes.entity';
import { Columns } from '@/entities/Columns.entity';
import { Languages } from '@/entities/Languages.entity';
import { Fields } from '@/entities/Fields.entity';
import { Website } from '@/entities/Website.entity';
import { PatentTypes } from '@/entities/PatentTypes.entity';
import { PatentValidTypes } from '@/entities/PatentValidTypes.entity';
import { PeriodicalPeriods } from '@/entities/PeriodicalPeriods.entity';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { TermTypes } from '@/entities/TermTypes.entity';
import { Terms } from '@/entities/Terms.entity';
import { Users } from '@/entities/Users.entity';
import { Periodicals } from '@/entities/Periodicals.entity';
import { Policies } from '@/entities/Policies.entity';
import { Treatises } from '@/entities/Treatises.entity';
import { Patents } from '@/entities/Patents.entity';
import { Conferences } from '@/entities/Conferences.entity';
import { Institutions } from '@/entities/Institutions.entity';
DataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export const websiteRepository = DataSource.getRepository(Website);
export const articleTypesRepository = DataSource.getRepository(ArticleTypes);
export const columnsRepository = DataSource.getRepository(Columns);
export const fieldsRepository = DataSource.getRepository(Fields);
export const languagesRepository = DataSource.getRepository(Languages);
export const patentTypesRepository = DataSource.getRepository(PatentTypes);
export const patentValidTypesRepository = DataSource.getRepository(PatentValidTypes);
export const periodicalPeriodsRepository = DataSource.getRepository(PeriodicalPeriods);
export const policyTypesRepository = DataSource.getRepository(PolicyTypes);
export const subjectsRepository = DataSource.getRepository(Subjects);
export const termTypesRepository = DataSource.getRepository(TermTypes);
export const termsRepository = DataSource.getRepository(Terms);
export const usersRepository = DataSource.getRepository(Users);
export const periodicalsRepository = DataSource.getRepository(Periodicals);
export const policiesRepository = DataSource.getRepository(Policies);
export const treatisesRepository = DataSource.getRepository(Treatises);
export const patentsRepository = DataSource.getRepository(Patents);
export const conferencesRepository = DataSource.getRepository(Conferences);
export const institutionsRepository = DataSource.getRepository(Institutions);

