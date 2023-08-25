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
import Redlock from 'redlock';

@Injectable()
export class BookingService {
  private redisClient: Redis;
  private redlock: Redlock;
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
    private dataSource: DataSource,
    @Inject('REDIS_CLIENT') redisClient: Redis,
  ) {
    this.redisClient = redisClient;
    this.redlock = new Redlock([redisClient as any], {
      driftFactor: 0.01, // clock drift를 보상하기 위해 driftTime 지정에 사용되는 요소, 해당 값과 아래 ttl값을 곱하여 사용.
      retryCount: 10, // 에러 전까지 재시도 최대 횟수
      retryDelay: 200, // 각 시도간의 간격
      retryJitter: 2000, // 재시도시 더해지는 되는 쵀대 시간(ms)
    });
  }
  async createBooking(goodsId: number, userId: number) {
    const qb = this.dataSource.createQueryBuilder();
    const lockResource = [`goodsId:${goodsId}:lock`]; // 락을 식별하는 고유 문자열
    const lock = await this.redlock.acquire(lockResource, 20000); // 20초 뒤에 자동 잠금해제

    try {
      // 1. 예매수 및 Limit 확인
      // span 추가
      const findGoodsSpan = apm.startSpan('findGoodsSpan');
      const bookingCount = await this.redisClient.get(`goodsId:${goodsId}`);
      const bookingLimit = await this.redisClient.get(
        `bookingLimitOfGoodsId:${goodsId}`,
      );
      // if (!cachedBookingCount || !cachedBookingLimit) {
      //   const findGoods = await qb
      //     .select([
      //       'GoodsEntity.id',
      //       'GoodsEntity.bookingLimit',
      //       'GoodsEntity.bookingCount',
      //     ])
      //     .from(GoodsEntity, 'GoodsEntity')
      //     .where('id=:id', { id: goodsId })
      //     .getOne();

      //   bookingCount = findGoods.bookingCount;
      //   bookingLimit = findGoods.bookingLimit;
      //   await this.redisClient.set(
      //     `bookingLimitOfGoodsId:${findGoods.id}`,
      //     bookingLimit,
      //   );
      // } else {
      //   // 레디스에서 가져온 데이터 타입은 스트링이므로 숫자로 변환
      //   bookingCount = +cachedBookingCount;
      //   bookingLimit = +cachedBookingLimit;
      // }

      findGoodsSpan.end();

      // 2. 예매 limit보다 많을 경우, Error 처리 진행
      if (Number(bookingCount) >= Number(bookingLimit)) {
        //! throw 에러 처리를 하면 부하 테스트 단계에서 에러가 나서 일단 주석처리
        // throw new ConflictException({
        //   errorMessage: '남은 좌석이 없습니다.',
        // });
        await this.redisClient.lpush(`waitlist:${goodsId}`, userId);
        return { message: '예매가 초과되어 대기자 명단에 등록 되었습니다' };
      }

      const pubSpan = apm.startSpan('pubSpan');
      await this.redisClient.publish(
        'Ticket',
        JSON.stringify({ goodsId, userId }),
      );
      await this.redisClient.incr(`goodsId:${goodsId}`);
      pubSpan.end();
    } catch (err) {
      // error를 Transaction 블록 외부로 던지기 위함
      throw err;
    } finally {
      lock.release();
    }
    // Transaction 정상 시 성공 메세지 출력
    return { message: '예약 성공!' };
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
