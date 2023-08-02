import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/auth/entities/user.entity';
import { GoodsEntity } from 'src/goods/entities/goods.entity';

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
      entities: [UserEntity, GoodsEntity], // TypeORM이 엔티티를 인식할 수 있게 설정
      synchronize: false, //! 주의! 이거 true 되면 데이터베이스 리셋됩니다
    };
  }
}