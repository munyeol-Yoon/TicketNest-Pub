import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'ticketNest-test',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
