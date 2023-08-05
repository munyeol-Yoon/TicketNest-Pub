import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsDto } from './dto/goods.dto';

@Controller('api/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  async findAll() {
    return await this.goodsService.findAll();
  }

  @Get(':goodsid')
  async findOne(@Param('goodsid') goodsId: number) {
    return await this.goodsService.findOne(goodsId);
  }

  @Post()
  async create(@Body() body: GoodsDto) {
    return await this.goodsService.create(body);
  }

  @Patch(':goodsid')
  async patch(
    @Param('goodsid') goodsId: number,
    @Body() body: GoodsDto,
    @Res() res,
  ) {
    await this.goodsService.patch(goodsId, body);
    return res.json({ message: '공연 예매 완료' });
  }

  @Delete(':goodsid')
  async remove(@Param('goodsid') goodsId: number, @Res() res) {
    await this.goodsService.remove(goodsId);
    return res.json({ message: '공연 취소 완료' });
  }
}
