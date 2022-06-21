import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModuleOptions, RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/index';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { RedisUtilModule } from './common/libs/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { FilesModule } from './modules/files/files.module';
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          entities: [`${__dirname}/entities/*{.ts,.js}`],
          migrations:['../migrations/*{.ts,.js}'],
          keepConnectionAlive: true,
          ...config.get('db'),
        } as TypeOrmModuleOptions;
      },
    }),
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
