import dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
export default () => {
  // 加载环境变量
  const env = dotenv.config();
  dotenvExpand.expand(env);
  // 定义oss回调路径
  const ossCallbackPath = '/api/file/callback';
  // 构建环境变量
  return {
    app: {
      prefix: process.env.APP_PREFIX || '/api',
      port: process.env.APP_PORT || 5000,
      logger: {
        dir: process.env.APP_LOGS_DIR || './logs',
      },
      envMode: process.env.ENV_MODE || 'dev', // envMo
      aliyunSendSms: {
        // 阿里云短信发送
        accessKeyId: process.env.ACCESS_KEY_ID || 'LTAIYmTPnyQ8EyOc',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || 'JgkeiXrvzooYZtERho581J0F8gCnQo',
        templateCode: {
          verification: process.env.TEMPLATE_CODE_VERIFICATION || 'SMS_140115102', // 短信验证模板
          retrieval: process.env.TEMPLATE_CODE_RETRIEVAL || 'SMS_138073386', // 密码找回模板
          resetNodeKey: process.env.TEMPLATE_CODE_RESETNODEKEY || 'SMS_139234404', // 找回阅读密码
        },
        signName: process.env.SIGN_NAME || '小雅智能助手',
      },
    },
    db: {
      type: process.env.POSTGRES_DB_TYPE || 'postgres',
      host: process.env.POSTGRES_DB_HOST || '127.0.0.1',
      port: Number(process.env.POSTGRES_DB_PORT) || 5434,
      username: process.env.POSTGRES_DB_USERNAME || 'postgres',
      password: process.env.POSTGRES_DB_PASSWORD || '1234abcdpostgres',
      database: process.env.POSTGRES_DB_DATABASE || 'postgres',
      cli: {
        'entitiesDir': '../entities',
        'migrationsDir': '../migrations'
      },
      synchronize: false,
      logging: false,
      migrationsRun: false,
      extra: {
        connectionLimit: process.env.POSTGRES_DB_POOL_SIZE || 20,
      },
    },
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 7379,
      password: process.env.REDIS_PASSWORD || 'a39ecd1899b1d6f3fe930302c78feb69',
      db: Number(process.env.REDIS_DB) || 0,
      keyPrefix: 'hy:',
    },
    jwt: {
      secretKey: process.env.JWT_SECRET || '12345678',
      expiresIn: process.env.JWT_EXPIRE || '24h',
    },
    encode: {
      secretKey: process.env.ENCODE_SECRET || '48836295ea78b737',
      iv: process.env.ENCODE_IV || 'fedf77768be478dc',
    },
    oss: {
      ossKeyId: process.env.OSS_KEY_ID || 'LTAIMj4vMg8VGEfB',
      ossKeySecret: process.env.OSS_KEY_SECRET || 'Oa23ZfIbw7hssq6VIDZbAX3S6hUxIN',
      ossRegion: process.env.OSS_REGION || 'oss-cn-shanghai',
      ossBucket: process.env.OSS_BUCKET || 'ass-node-test',
      ossCallbackUrl: `${process.env.SERVER_HOST}${ossCallbackPath}`,
      ossCallbackPath,
      imageMaxSize: process.env.IMAGE_MAX_SIZE || 5 * 1024 * 1024, // 5M
    },
  } as Record<string, any>;
};
