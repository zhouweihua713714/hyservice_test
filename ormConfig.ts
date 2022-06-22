import { ConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
let config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrationsRun: false,
  entities: [__dirname + '/src/entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/src/migrations/*.{ts,js}'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
  },
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  extra: {
    connectionLimit: process.env.POSTGRES_DB_POOL_SIZE || 20,
  }
};

if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    schema:'test_' + path.basename(expect.getState().testPath).split('.')[0]
  };
}

module.exports = config;
