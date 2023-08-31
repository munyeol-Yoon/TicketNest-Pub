import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './config/orm.config';
import { GoodsModule } from './goods/goods.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { BookingModule } from './booking/booking.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApmInterceptor } from './Interceptor/apm.interceptor';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from 'nestjs-redis';
const configService = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    GoodsModule,
    BookingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: typeORMConfig,
    }),
    BullModule.forRoot({
      redis: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        password: configService.get<string>('REDIS_PASSWORD'),
      },
    }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//   implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggingMiddleware).forRoutes('*');
//   }
// }
