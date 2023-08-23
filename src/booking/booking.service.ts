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
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    const qb = queryRunner.manager.createQueryBuilder();
    try {
      // 1. 예매수 및 Limit 확인
      // span 추가
      const findGoodsSpan = apm.startSpan('findGoodsSpan');
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
      findGoodsSpan.end();

      // 2. 예매 limit보다 많을 경우, Error 처리 진행
      if (findGoods.bookingCount >= findGoods.bookingLimit) {
        throw new ConflictException({
          errorMessage: '남은 좌석이 없습니다.',
        });
      }

      // goods update ms측정
      const goodsUpdateSpan = apm.startSpan('goodsUpdateSpan');
      // GoodsEntity의 BookingCount 업데이트
      await qb
        .update(GoodsEntity)
        .set({
          bookingCount: () => 'bookingCount + 1',
        })
        .where('id = :id', { id: goodsId })
        .useTransaction(true)
        .execute();
      goodsUpdateSpan.end();

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
