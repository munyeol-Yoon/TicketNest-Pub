import { Module } from '@nestjs/common';
import { BookingProcessor } from './bull.controller';
import { BookingService } from './bull.service';
import { RedisModule } from 'src/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { BookingEntity } from '../entity/booking.entity';
import { GoodsEntity } from 'src/goods/entities/goods.entity';

@Module({
  imports: [
    RedisModule,
    BullModule.registerQueue({ name: 'Ticket' }),
    TypeOrmModule.forFeature([BookingEntity, GoodsEntity]),
  ],
  // controllers: [BookingController],
  providers: [BookingService, BookingProcessor],
})
export class BookingModule {}
