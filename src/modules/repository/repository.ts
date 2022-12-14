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
import { Universities } from '@/entities/Universities.entity';
import { UserHistory } from '@/entities/UserHistory.entity';
import { UserFavoriteTreatises } from '@/entities/UserFavoriteTreatises.entity';
import { UserLabelTreatises } from '@/entities/UserLabelTreatises.entity';
import { UserNoteTreatises } from '@/entities/UserNoteTreatises.entity';
import { AnalysisPolicies } from '@/entities/AnalysisPolicies.entity';
import { TopicTypes } from '@/entities/TopicTypes.entity';
import { Keywords } from '@/entities/Keywords.entity';
import { TreatiseKeywords } from '@/entities/TreatiseKeywords.entity';
import { TermKeywords } from '@/entities/TermKeywords.entity';
import { UserKeywordStatistics } from '@/entities/UserKeywordStatistics.entity';
import { AmericaTerms } from '@/entities/AmericaTerms.entity';
import { AmericaTermKeywords } from '@/entities/AmericaTermKeywords.entity';
import { NSFDirectorateTypes } from '@/entities/NSFDirectorateTypes.entity';
import { TreatiseLibrary } from '@/entities/TreatiseLibrary.entity';
import { ResearchReports } from '@/entities/ResearchReports.entity';
import { TreatiseLibraryTypes } from '@/entities/TreatiseLibraryTypes.entity';
import { TreatiseLibraryKeywords } from '@/entities/TreatiseLibraryKeywords.entity';
import { AssemblyPolicies } from '@/entities/AssemblyPolicies.entity';
DataSource.initialize()
  .then(() => {
    // console.log('Data Source has been initialized!');
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
export const universitiesRepository = DataSource.getRepository(Universities);
export const userHistoryRepository = DataSource.getRepository(UserHistory);
export const userFavoriteTreatisesRepository = DataSource.getRepository(UserFavoriteTreatises);
export const userLabelTreatisesRepository = DataSource.getRepository(UserLabelTreatises);
export const userNoteTreatisesRepository = DataSource.getRepository(UserNoteTreatises);
export const analysisPoliciesRepository = DataSource.getRepository(AnalysisPolicies);
export const topicTypesRepository = DataSource.getRepository(TopicTypes);
export const nsfDirectorateTypesRepository = DataSource.getRepository(NSFDirectorateTypes);
export const keywordsRepository = DataSource.getRepository(Keywords);
export const treatiseKeywordsRepository = DataSource.getRepository(TreatiseKeywords);
export const termKeywordsRepository = DataSource.getRepository(TermKeywords);
export const userKeywordStatisticsRepository = DataSource.getRepository(UserKeywordStatistics);
export const americaTermsRepository = DataSource.getRepository(AmericaTerms);
export const americaTermKeywordsRepository = DataSource.getRepository(AmericaTermKeywords);
export const treatiseLibraryRepository = DataSource.getRepository(TreatiseLibrary);
export const researchReportsRepository = DataSource.getRepository(ResearchReports);
export const treatiseLibraryTypesRepository = DataSource.getRepository(TreatiseLibraryTypes);
export const treatiseLibraryKeywordsRepository = DataSource.getRepository(TreatiseLibraryKeywords);
export const assemblyPoliciesRepository = DataSource.getRepository(AssemblyPolicies);




