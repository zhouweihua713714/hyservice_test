
module.exports = {    
    type: process.env.POSTGRES_DB_TYPE || 'postgres',
    host: process.env.POSTGRES_DB_HOST || '127.0.0.1',
    port: Number(process.env.POSTGRES_DB_PORT) || 5434,
    username: process.env.POSTGRES_DB_USERNAME || 'postgres',
    password: process.env.POSTGRES_DB_PASSWORD || '1234abcdpostgres',
    database: process.env.POSTGRES_DB_DATABASE || 'postgres',
    migrationsRun: true,
    entities: ['src/entities/*{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    cli: {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migrations"
    },
    synchronize: false,
    logging: false,
    extra: {
      connectionLimit: process.env.POSTGRES_DB_POOL_SIZE || 20,
    },
};
