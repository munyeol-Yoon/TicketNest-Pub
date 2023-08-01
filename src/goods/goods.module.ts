import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
  controllers: [GoodsController],
  providers: [GoodsService]
})
export class GoodsModule {}
