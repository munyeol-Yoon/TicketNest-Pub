import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { Repository } from 'typeorm';
import { BookingEntity } from './entity/booking.entity';
import { GoodsEntity } from '../goods/entities/goods.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let goodsRepositoryMock: any;
  let bookingRepositoryMock: any;

  beforeEach(async () => {
    bookingRepositoryMock = {
      countBy: jest.fn(),
      save: jest.fn(), // save로 method 변경 후 test시 사용
      insert: jest.fn(),
      delete: jest.fn(),
    };
    goodsRepositoryMock = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(GoodsEntity),
          useValue: goodsRepositoryMock,
        },
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: bookingRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createBooking success Case', async () => {
    bookingRepositoryMock.countBy.mockResolvedValue(480);
    // jest
    //   .spyOn(goodsRepository, 'findOne')
    //   .mockResolvedValue({ bookingLimit: 500 });
    // spyOn이 아닌 Mock함수로 한 이유 : spyOn으로 하면 goods의 Column을 모두 넣어줘야 함
    goodsRepositoryMock.findOne.mockResolvedValue({ bookingLimit: 500 });

    await expect(service.createBooking(1, 1)).resolves.toEqual({
      Success: true,
    });
  });

  it('createBooking 좌석이 없는 경우 Fail case', async () => {
    bookingRepositoryMock.countBy.mockResolvedValue(530);
    goodsRepositoryMock.findOne.mockResolvedValue({ bookingLimit: 500 });

    await expect(service.createBooking(1, 1)).rejects.toThrow(
      ConflictException,
    );
  });

  it('deleteBooking 성공 Case', async () => {
    bookingRepositoryMock.delete.mockResolvedValue({ affected: 1 });

    // 0보다 큰 값일 경우 Truthy
    await expect(service.deleteBooking(1, 1)).resolves.toBeTruthy();
  });

  it('deleteBooking Fail Case', async () => {
    bookingRepositoryMock.delete.mockResolvedValue(null);

    await expect(service.deleteBooking(1, 1)).rejects.toThrow(
      NotFoundException,
    );
  });
});
