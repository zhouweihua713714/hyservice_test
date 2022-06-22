require('dotenv');

import rateLimit from 'express-rate-limit';
import 'tsconfig-paths/register';
import helmet from 'helmet';

import { mw as requestIpMw } from 'request-ip';

import express from 'express';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import { logger } from './common/libs/log4js/logger.middleware';
import { Logger } from './common/libs/log4js/log4j.util';
import { TransformInterceptor } from './common/libs/log4js/transform.interceptor';
import { HttpExceptionsFilter } from './common/libs/log4js/httpExceptions.filter';
import { ExceptionsFilter } from './common/libs/log4js/exceptions.filter';

import Chalk from 'chalk';
import { EnvModeType } from './common/enums/common.enum';

async function bootstrap() {
  // 根据环境变量启动不同的服务
  const appName = process.env.APP_NAME;
  const currentModule = AppModule;
  const app = await NestFactory.create(currentModule, {
    cors: true,
  });

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 10000, // 限制15分钟内最多只能访问10000次
    })
  );

  // 配置不同的前缀和端口
  const config = app.get(ConfigService);
  const appConfig = config.get<Record<string, any>>('app');

  // 设置 api 访问前缀
  app.setGlobalPrefix(appConfig?.prefix);

  // web 安全, 防常见漏洞
  if (process.env.NODE_ENV === 'production' && process.env.ENV_MODE === EnvModeType.PUBLICATION) {
    app.use(helmet());
  }

  const swaggerOptions = new DocumentBuilder()
    .setTitle(`HY Server ${appName || 'API'}`)
    .setDescription(`HY Server  ${appName || 'API'} 接口文档`)
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // 项目依赖当前文档功能, 最好不要改变当前地址
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup(`${appConfig?.prefix}/docs`, app, document, {
    swaggerOptions: {
      explorer: true,
      persistAuthorization: true,
    },
    customSiteTitle: 'HY Server API Docs',
  });

  // 防止跨站请求伪造
  // 设置 csrf 保存 csrfToken
  // app.use(csurf())

  // 获取真实 ip
  app.use(requestIpMw({ attributeName: 'ip' }));

  // 全局验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true, // 开发环境
      disableErrorMessages: false,
    })
  );

  // 日志
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // 使用全局拦截器打印出参, 暂时先关掉
  app.use(logger);
  app.useGlobalInterceptors(new TransformInterceptor());
  // 所有异常
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());
  await app.listen(appConfig?.port);

  Logger.log(
    Chalk.green('swagger 文档地址'),
    `http://localhost:${appConfig?.port}${appConfig?.prefix}/docs/`
  );
}

bootstrap();
