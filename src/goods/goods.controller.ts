import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsDto } from './dto/goods.dto';

@Controller('api/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  findAll() {
    return this.goodsService.findAll();
  }

  @Get(':goodsid')
  findOne(@Param('goodsid') goodsId: number) {
    return this.goodsService.findOne(goodsId);
  }

  @Post()
  async create(@Body() body: GoodsDto) {
    return await this.goodsService.create(body);
  }

  @Patch(':goodsid')
  patch(@Param('goodsid') goodsId: number, @Body() body: GoodsDto) {
    return this.goodsService.updateOne(goodsId, body);
  }

  @Delete(':goodsid')
  remove(@Param('goodsid') goodsId: number) {
    this.goodsService.deleteOne(goodsId);
  }
}
