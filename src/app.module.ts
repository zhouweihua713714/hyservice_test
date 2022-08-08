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
@Module({
  imports: [
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
    TypeOrmModule.forFeature([Users, Files, Codes, Logins,Website]),
    HomeModule,
    AuthModule,
    FilesModule,
    DaoModule,
    HomepageModule,
    ConfigsModule
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
