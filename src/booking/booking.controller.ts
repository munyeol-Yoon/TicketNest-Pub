import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('booking')
@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({
    summary: '공연 예약 API',
    description: '공연 예약을 합니다.',
  })
  @Post(':goodsId')
  @UseGuards(AuthGuard('jwt')) //  토큰을 검증하고 해당 유저의 정보를 req 객체에 담아주는 역할
  async createBooking(
    @Param('goodsId') goodsId: number,
    // @Body('userId') userId: number,
    @Req() req,
    @Res() res: Response,
  ) {
    const userId = req.user; // 객체안에 user키의 값을 담아줌
    await this.bookingService.createBooking(goodsId, userId);
    return res.status(201).json({ message: '공연 예약 완료!' });
  }

  @ApiOperation({
    summary: '공연 예약취소 API',
    description: '공연 예약을 취소합니다.',
  })
  @Delete(':goodsId')
  @UseGuards(AuthGuard('jwt'))
  async deleteBooking(
    @Param('goodsId') goodsId: number,
    // @Body() userId: number,
    @Req() req,
    @Res() res: Response,
  ) {
    const userId = req.user;
    await this.bookingService.deleteBooking(goodsId, userId);
    return res.status(200).json({ message: '공연 예매 취소 완료!' });
  }
}
