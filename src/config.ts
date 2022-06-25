import dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { options } from './dataSource';
export const getConfig = () => {
  const env = dotenv.config();
  dotenvExpand.expand(env);

  const ossCallbackPath = '/api/file/callback';

  return {
    app: {
      prefix: process.env.APP_PREFIX || '/api',
      port: process.env.APP_PORT || 3000,
      logger: {
        dir: process.env.APP_LOGS_DIR || './logs',
      },
      envMode: process.env.ENV_MODE || 'dev',
      aliyunSendSms: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        templateCode: {
          verification: process.env.SMS_TEMPLATE_CODE_VERIFICATION,
          retrieval: process.env.SMS_TEMPLATE_CODE_RETRIEVAL,
          resetNodeKey: process.env.SMS_TEMPLATE_CODE_RESET_NODE_KEY,
        },
        signName: process.env.SIGN_NAME,
      },
    },
    redis: {
      host: process.env.REDIS_HOST!,
      port: process.env.REDIS_PORT!,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      keyPrefix: 'hy:',
    },
    jwt: {
      secretKey: process.env.JWT_SECRET || '12345678',
      expiresIn: process.env.JWT_EXPIRE || '24h',
    },
    encode: {
      secretKey: process.env.ENCODE_SECRET,
      iv: process.env.ENCODE_IV,
    },
    oss: {
      ossKeyId: process.env.OSS_KEY_ID!,
      ossKeySecret: process.env.OSS_KEY_SECRET!,
      ossRegion: process.env.OSS_REGION!,
      ossBucket: process.env.OSS_BUCKET!,
      ossCallbackUrl: `${process.env.SERVER_HOST}${ossCallbackPath}`,
      ossCallbackPath,
      imageMaxSize: process.env.IMAGE_MAX_SIZE || 5 * 1024 * 1024, // 5M
    },
    postgres: options,
  } as const;
};
