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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('goods')
@Controller('api/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @ApiOperation({
    summary: '공연 전체 조회 API',
    description: '공연을 전체 조회합니다',
  })
  @Get()
  async findAll() {
    return await this.goodsService.findAll();
  }

  @ApiOperation({
    summary: '공연 상세 조회 API',
    description: '공연 하나를 상세하게 조회합니다',
  })
  @Get(':goodsid')
  async findOne(@Param('goodsid') goodsId: number) {
    return await this.goodsService.findOne(goodsId);
  }

  @ApiOperation({
    summary: '공연 생성 API',
    description: '공연 Goods를 생성합니다.',
  })
  @Post()
  async create(@Body() body: GoodsDto) {
    return await this.goodsService.create(body);
  }

  @ApiOperation({
    summary: '공연 수정 API',
    description: '공연 Goods를 수정합니다',
  })
  @Patch(':goodsid')
  async patch(
    @Param('goodsid') goodsId: number,
    @Body() body: GoodsDto,
    @Res() res,
  ) {
    await this.goodsService.patch(goodsId, body);
    return res.json({ message: '공연 예매 완료' });
  }

  @ApiOperation({
    summary: '공연 삭제 API',
    description: '공연 Goods를 삭제합니다',
  })
  @Delete(':goodsid')
  async remove(@Param('goodsid') goodsId: number, @Res() res) {
    await this.goodsService.remove(goodsId);
    return res.json({ message: '공연 취소 완료' });
  }
}
