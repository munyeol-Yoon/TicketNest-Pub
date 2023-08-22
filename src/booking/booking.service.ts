import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { DataSource, Repository } from 'typeorm';
import { GoodsEntity } from '../goods/entities/goods.entity';
import * as apm from 'elastic-apm-node';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
    private dataSource: DataSource,
  ) {}
  async createBooking(goodsId: number, userId: number) {
    //Transaction 적용을 위한 queryRunner 사용
    const queryRunner = this.dataSource.createQueryRunner();
    const queryRunnerSpan = apm.startSpan('QueryRunner');
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    queryRunnerSpan.end();
    try {
      // 1. 예매수 및 Limit 확인
      // span 추가
      const findGoodsSpan = apm.startSpan('findGoodsSpan');

      const findGoods = await queryRunner.manager.findOne(GoodsEntity, {
        where: { id: goodsId },
        select: { id: true, bookingLimit: true, bookingCount: true },
        // lock 수준을 배타락으로 설정
        // Transaction을 진행중인 동안, 다른 Transaction이 읽기를 금지하기 위해
        lock: { mode: 'pessimistic_write' },
      });
      // 2. 예매 limit보다 많을 경우, Error 처리 진행
      findGoodsSpan.end();
      if (findGoods.bookingCount >= findGoods.bookingLimit) {
        throw new ConflictException({
          errorMessage: '남은 좌석이 없습니다.',
        });
      }
      ++findGoods.bookingCount;
      // GoodsEntity의 BookingCount 업데이트

      const goodsUpdateSpan = apm.startSpan('goodsUpdateSpan');
      await queryRunner.manager.save(GoodsEntity, findGoods, {
        transaction: true,
      });
      goodsUpdateSpan.end();
      // BookingEntity에 예매 진행

      const bookingSaveSpan = apm.startSpan('bookingSaveSpan');
      await queryRunner.manager.save(
        BookingEntity,
        {
          goodsId,
          userId,
        },
        { transaction: true },
      );

      bookingSaveSpan.end();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // error를 Transaction 블록 외부로 던지기 위함
      throw err;
    } finally {
      await queryRunner.release();
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
