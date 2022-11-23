import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModuleOptions, RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { APP_GUARD } from '@nestjs/core';
import { getConfig } from '@/config';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { RedisUtilModule } from './common/libs/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { FilesModule } from './modules/files/files.module';
import { DaoModule } from './dao/dao.module';
import { Codes } from './entities/Codes.entity';
import { Logins } from './entities/Logins.entity';
import { Users } from './entities/Users.entity';
import { Files } from './entities/Files.entity';
import { HomepageModule } from './modules/homepage/homepage.module';
import { Website } from './entities/Website.entity';
import { ConfigsModule } from './modules/configs/configs.module';
import { TermsModule } from './modules/terms/terms.module';
import { Columns } from './entities/Columns.entity';
import { TermTypes } from './entities/TermTypes.entity';
import { Subjects } from './entities/Subjects.entity';
import { Terms } from './entities/Terms.entity';
import { PeriodicalsModule } from './modules/periodicals/periodicals.module';
import { Languages } from './entities/Languages.entity';
import { PeriodicalPeriods } from './entities/PeriodicalPeriods.entity';
import { Periodicals } from './entities/Periodicals.entity';
import { PoliciesModule } from './modules/policies/policies.module';
import { Policies } from './entities/Policies.entity';
import { PolicyTypes } from './entities/PolicyTypes.entity';
import { ArticleTypes } from './entities/ArticleTypes.entity';
import { Treatises } from './entities/Treatises.entity';
import { TreatisesModule } from './modules/treatises/treatises.module';
import { PatentsModule } from './modules/patents/patents.module';
import { Patents } from './entities/Patents.entity';
import { PatentTypes } from './entities/PatentTypes.entity';
import { PatentValidTypes } from './entities/PatentValidTypes.entity';
import { Conferences } from './entities/Conferences.entity';
import { ConferencesModule } from './modules/conferences/conferences.module';
import { Fields } from './entities/Fields.entity';
import { Institutions } from './entities/Institutions.entity';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { Universities } from './entities/Universities.entity';
import { UsersModule } from './modules/users/users.module';
import { UserHistory } from './entities/UserHistory.entity';
import { UserFavoriteTreatises } from './entities/UserFavoriteTreatises.entity';
import { UserLabelTreatises } from './entities/UserLabelTreatises.entity';
import { UserNoteTreatises } from './entities/UserNoteTreatises.entity';
import { AnalysisPolicies } from './entities/AnalysisPolicies.entity';
import { TopicTypes } from './entities/TopicTypes.entity';
import { Keywords } from './entities/Keywords.entity';
import { UserKeywordStatistics } from './entities/UserKeywordStatistics.entity';
import { AmericaTerms } from './entities/AmericaTerms.entity';
import { AmericaTermKeywords } from './entities/AmericaTermKeywords.entity';
import { TreatiseKeywords } from './entities/TreatiseKeywords.entity';
import { TermKeywords } from './entities/TermKeywords.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { NSFDirectorateTypes } from './entities/NSFDirectorateTypes.entity';
import { TreatiseLibraryModule } from './modules/treatises/treatiseLibrary/treatiseLibrary.module';
import { TreatiseLibrary } from './entities/TreatiseLibrary.entity';
import { TreatiseLibraryTypes } from './entities/TreatiseLibraryTypes.entity';
import { ResearchReports } from './entities/ResearchReports.entity';
import { ReportsModule } from './modules/reports/reports.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg) => {
        const config = {
          ...cfg.get('postgres'),
          autoLoadEntities: true,
        };
        return config;
      },
    }),
    RedisUtilModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<RedisModuleOptions> => {
        const redisConfig = config.get<RedisClientOptions>('redis');
        return {
          closeClient: true,
          readyLog: true,
          config: redisConfig,
        };
      },
    }),
    TypeOrmModule.forFeature([
      Users,
      Files,
      Codes,
      Logins,
      Website,
      Columns,
      TermTypes,
      Subjects,
      Terms,
      Languages,
      PeriodicalPeriods,
      Periodicals,
      Policies,
      PolicyTypes,
      ArticleTypes,
      Treatises,
      Patents,
      PatentTypes,
      PatentValidTypes,
      Conferences,
      Fields,
      Institutions,
      Universities,
      UserHistory,
      UserFavoriteTreatises,
      UserLabelTreatises,
      UserNoteTreatises,
      AnalysisPolicies,
      TopicTypes,
      NSFDirectorateTypes,
      Keywords,
      UserKeywordStatistics,
      AmericaTerms,
      AmericaTermKeywords,
      TreatiseKeywords,
      TermKeywords,
      TreatiseLibrary,
      TreatiseLibraryTypes,
      ResearchReports
    ]),
    HomeModule,
    AuthModule,
    FilesModule,
    DaoModule,
    HomepageModule,
    ConfigsModule,
    TermsModule,
    PeriodicalsModule,
    PoliciesModule,
    TreatisesModule,
    PatentsModule,
    ConferencesModule,
    InstitutionsModule,
    UsersModule,
    TasksModule,
    TreatiseLibraryModule,
    ReportsModule
  ],
  // 守卫
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
