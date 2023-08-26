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
import subRedis from 'ioredis';

@Injectable()
export class BookingService {
  private redisClient: Redis;
  private redlock: Redlock;
  private subscriber: Redis;
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
    private dataSource: DataSource,
    @Inject('REDIS_CLIENT') redisClient: Redis,
  ) {
    this.redisClient = redisClient;
    this.subscriber = new subRedis(); // 구독을 위해 별도의 클라이언트 생성
    this.redlock = new Redlock([redisClient], {
      driftFactor: 0.01, // clock drift를 보상하기 위해 driftTime 지정에 사용되는 요소, 해당 값과 아래 ttl값을 곱하여 사용.
      retryCount: 10, // 에러 전까지 재시도 최대 횟수
      retryDelay: 200, // 각 시도간의 간격
      retryJitter: 200, // 재시도시 더해지는 되는 무작위 시간(ms)
    });

    // 구독자 생성
    this.subscriber.subscribe('Ticket');
    this.subscriber.on('message', async (channel, message) => {
      if (channel === 'Ticket') {
        // const data = JSON.parse(message);
        try {
          // await this.createBooking(data.goodsId, data.userId);
          console.log(message);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
  async createBooking(goodsId: number, userId: number) {
    //Transaction 적용을 위한 queryRunner 사용
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    const channel = 'Ticket';
    const lockResource = [`goodsId:${goodsId}:lock`]; // 락을 식별하는 고유 문자열
    const lock = await this.redlock.acquire(lockResource, 2000); // 2초 뒤에 자동 잠금해제

    const qb = queryRunner.manager.createQueryBuilder();
    try {
      // 1. 예매수 및 Limit 확인
      // span 추가
      const findGoodsSpan = apm.startSpan('findGoodsSpan');
      const cachedBookingCount = await this.redisClient.get(
        `goodsId:${goodsId}`,
      );
      const cachedBookingLimit = await this.redisClient.get(
        `bookingLimitOfGoodsId:${goodsId}`,
      );

      let bookingCount: number;
      let bookingLimit: number;

      if (!cachedBookingCount || !cachedBookingLimit) {
        const findGoods = await qb
          .select([
            'GoodsEntity.id',
            'GoodsEntity.bookingLimit',
            'GoodsEntity.bookingCount',
          ])
          .from(GoodsEntity, 'GoodsEntity')
          .where('id=:id', { id: goodsId })
          .setLock('pessimistic_write')
          .getOne();

        bookingCount = findGoods.bookingCount;
        bookingLimit = findGoods.bookingLimit;
        await this.redisClient.set(
          `bookingLimitOfGoodsId:${findGoods.id}`,
          bookingLimit,
        );
      } else {
        // 레디스에서 가져온 데이터 타입은 스트링이므로 숫자로 변환
        bookingCount = +cachedBookingCount;
        bookingLimit = +cachedBookingLimit;
      }

      findGoodsSpan.end();

      // 2. 예매 limit보다 많을 경우, Error 처리 진행
      if (bookingCount >= bookingLimit) {
        //! throw 에러 처리를 하면 부하 테스트 단계에서 에러가 나서 일단 주석처리
        // throw new ConflictException({
        //   errorMessage: '남은 좌석이 없습니다.',
        // });
        await this.redisClient.lpush(`waitlist:${goodsId}`, userId);
        return { message: '예매가 초과되어 대기자 명단에 등록 되었습니다' };
      }

      // // goods update ms측정
      // const goodsUpdateSpan = apm.startSpan('goodsUpdateSpan');
      // // GoodsEntity의 BookingCount 업데이트
      // await qb
      //   .update(GoodsEntity)
      //   .set({
      //     bookingCount: () => 'bookingCount + 1',
      //   })
      //   .where('id = :id', { id: goodsId })
      //   .useTransaction(true)
      //   .execute();

      // goodsUpdateSpan.end();

      //Booking insert ms 측정
      const bookingSaveSpan = apm.startSpan('bookingSaveSpan');
      // bookingEntity Insert 진행
      await qb
        .insert()
        .into(BookingEntity)
        .values({
          goodsId,
          userId,
        })
        .useTransaction(true)
        .execute();
      await this.redisClient.incr(`goodsId:${goodsId}`); // 이 부분 분산 트랜잭션 필요함.

      bookingSaveSpan.end();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // error를 Transaction 블록 외부로 던지기 위함
      throw err;
    } finally {
      await lock.release();
      await queryRunner.release();
      await this.redisClient.publish(
        channel,
        `goodsId:${goodsId}의 락이 해제되었습니다`,
      );
    }
    // Transaction 정상 시 성공 메세지 출력
    return { message: '예약 성공!' };
  }

  async deleteBooking(goodsId: number, userId: number) {
    const deleteBooking = await this.bookingRepository.delete({
      userId,
      goodsId,
    });
    await this.redisClient.decr(`goodsId:${goodsId}`);

    if (!deleteBooking)
      throw new NotFoundException({
        errorMessage: '예매정보를 찾을 수 없습니다.',
      });

    return deleteBooking.affected > 0;
  }
}
