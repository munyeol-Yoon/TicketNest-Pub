import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { GoodsEntity } from 'src/goods/entities/goods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity, GoodsEntity])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
