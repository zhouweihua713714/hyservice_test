// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import path from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

let schema = 'development';
if (process.env.NODE_ENV === 'test') {
  schema = 'test_' + path.basename(expect.getState().testPath).split('.')[0];
}

export const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  schema,
  entities: [__dirname + '/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: process.env.NODE_ENV === 'development'
};

export default new DataSource(options);
