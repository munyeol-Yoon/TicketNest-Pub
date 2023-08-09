import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Response } from 'express';

describe('BookingController', () => {
  let controller: BookingController;
  let bookingService: BookingService;

  beforeEach(async () => {
    const bookingServiceMock = {
      createBooking: jest.fn(),
      deleteBooking: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: bookingServiceMock,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 공연 예매 API test
  it('POST /api/booking/:goodsId', async () => {
    const userId = 111;
    const goodsId = 123;

    // Response 객체를 Mock 하는 부분. Response 객체의 일부 메서드를 모의하기 위해 제작.
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response; // 타입 단언을 사용하는 방법
    // 모의 객체는 실제 Response 객체의 전체 API를 구현하지 않는다.
    // 따라서 unknown으로 타입을 변환하고, Response로 타입을 변환해 타입 체크 오류를 피할 수 있다.

    // booking controller의 createBooking을 호출
    await controller.createBooking(goodsId, userId, mockRes);

    // Service의 createBooking에 올바른 인자값이 호출되었는가?
    expect(bookingService.createBooking).toHaveBeenCalledWith(goodsId, userId);
    // Controller의 status와 json이 제대로 호출되었는가?
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '공연 예약 완료!' });
  });

  // 공연 예매 취소 API test
  it('DELETE /api/booking/:goodsId', async () => {
    const userId = 111;
    const goodsId = 123;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.deleteBooking(goodsId, userId, mockRes);
    // Service의 createBooking에 올바른 인자값이 호출되었는가?
    expect(bookingService.deleteBooking).toHaveBeenCalledWith(goodsId, userId);
    // Controller의 status와 json이 제대로 호출되었는가?
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '공연 예매 취소 완료!',
    });
  });
});
