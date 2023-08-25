import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { DataSource, Repository } from 'typeorm';
import { GoodsEntity } from '../goods/entities/goods.entity';
import * as apm from 'elastic-apm-node';
import Redis from 'ioredis';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
    private dataSource: DataSource,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {
    this.redisClient = redisClient;
  }
  async createBooking(goodsId: number, userId: number) {
    const pubSpan = apm.startSpan('pubSpan');
    await this.redisClient.publish(
      'Ticket',
      JSON.stringify({ goodsId, userId }),
    );
    await this.redisClient.incr(`goodsId:${goodsId}`);
    pubSpan.end();

    // Transaction 정상 시 성공 메세지 출력
    return { message: 'Pub 성공!' };
  }

  async deleteBooking(goodsId: number, userId: number) {
    const deleteBooking = await this.bookingRepository.delete({
      userId,
      goodsId,
    });

    if (!deleteBooking)
      throw new NotFoundException({
        errorMessage: '예매정보를 찾을 수 없습니다.',
      });

    return deleteBooking.affected > 0;
  }
}
