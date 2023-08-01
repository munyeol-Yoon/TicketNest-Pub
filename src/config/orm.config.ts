import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
// export const typeORMConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: '1234',
//   database: 'ticketNest-test',
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: true,
// };

// export default class TypeOrmConfig {
//   static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
//     return {
//       type: configService.get('DB_TYPE'),
//       host: configService.get('DB_HOST'),
//       port: +configService.get('DB_PORT'),
//       username: configService.get('DB_USER'),
//       password: configService.get('DB_PASSWORD'),
//       database: configService.get('DB_DATABASE'),
//       entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       synchronize: false,
//     };
//   }
// }
// export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
//   imports: [ConfigModule],
//   useFactory: async (
//     configService: ConfigService,
//   ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
//   inject: [ConfigService],
// };

@Injectable()
export class typeORMConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      synchronize: false, //! 주의! 이거 true 되면 데이터베이스 리셋됩니다
    };
  }
}
