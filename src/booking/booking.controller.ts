import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { Response } from 'express';

@ApiTags('booking')
@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({
    summary: '공연 예약 API',
    description: '공연 예약을 합니다.',
  })
  @Post(':goodsId')
  async createBooking(
    @Param('goodsId') goodsId: number,
    @Body('userId') userId: number,
    @Res() res: Response,
  ) {
    console.log(userId);
    await this.bookingService.createBooking(goodsId, userId);
    return res.status(201).json({ message: '공연 예약 완료!' });
  }

  @ApiOperation({
    summary: '공연 예약취소 API',
    description: '공연 예약을 취소합니다.',
  })
  @Delete(':goodsId')
  async deleteBooking(
    @Param('goodsId') goodsId: number,
    @Body() userId: number,
    @Res() res: Response,
  ) {
    await this.bookingService.deleteBooking(goodsId, userId);
    return res.status(200).json({ message: '공연 예매 취소 완료!' });
  }
}
