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
import { CodesRepo } from './entities/Codes.repo';
import { FilesRepo } from './entities/Files.repo';
import { LoginsRepo } from './entities/Logins.repo';
import { UsersRepo } from './entities/Users.repo';
import { DaoModule} from './dao/dao.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('../ormconfig');

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
      isGlobal: true,
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = {
          keepConnectionAlive: true,
          ...ormConfig,
        } as TypeOrmModuleOptions;
        return config;
      },
    }),

    TypeOrmModule.forFeature([UsersRepo, FilesRepo, CodesRepo, LoginsRepo]),
    // redis
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
    // 业务模块
    HomeModule,
    AuthModule,
    FilesModule,
    DaoModule
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
