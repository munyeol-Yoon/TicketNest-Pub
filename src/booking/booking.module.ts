import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { GoodsEntity } from 'src/goods/entities/goods.entity';
import { RedisModule } from 'src/redis/redis.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, GoodsEntity]),
    BullModule.registerQueue({ name: 'Ticket' }),
    RedisModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
