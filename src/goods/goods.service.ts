import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsEntity } from './entities/goods.entity';
import { GoodsDto, updateGoodsDto } from './dto/goods.dto';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
  ) {}

  async findAll(): Promise<GoodsEntity[]> {
    return this.goodsRepository.find();
  }

  async findOne(goodsid: number): Promise<GoodsEntity> {
    const goods = this.goodsRepository.findOne({ where: { goodsId: goodsid } });
    if (!goods) {
      throw new NotFoundException({
        errorMessage: '공연 정보가 존재하지 않습니다.',
      });
    }
    return goods;
  }

  async create(goodsData: GoodsDto): Promise<GoodsEntity> {
    const { userId, title, content, price, imgUrl, showDate, bookingLimit } =
      goodsData;
    const goods = this.goodsRepository.create({
      userId,
      title,
      content,
      price,
      imgUrl,
      showDate,
      bookingLimit,
    });

    await this.goodsRepository.save(goods);
    return goods;
  }

  async updateOne(goodsid: number, updateData: updateGoodsDto) {
    const { title, content, price, imgUrl, showDate, bookingLimit } =
      updateData;
    const updateTarget = await this.goodsRepository.findOne({
      where: { goodsId: goodsid },
    });

    if (!updateTarget) {
      throw new NotFoundException({
        errorMessage: '공연 정보가 존재하지 않습니다.',
      });
    }

    const goods = await this.goodsRepository.update(goodsid, {
      title,
      content,
      price,
      imgUrl,
      showDate,
      bookingLimit,
    });
  }

  async deleteOne(goodsid: number): Promise<void> {
    const deleteTarget = await this.goodsRepository.delete({
      goodsId: goodsid,
    });
  }
}
