import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';
import GoodsSeeder from './seeds/goods.seeder';

config({ path: '.env' });

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  seeds: [UserSeeder, GoodsSeeder],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

export const dataSource = new DataSource(options);
