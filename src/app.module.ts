import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './config/orm.config';
import { GoodsModule } from './goods/goods.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), AuthModule, GoodsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
