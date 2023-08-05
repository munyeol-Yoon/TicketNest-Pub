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
    return await this.goodsRepository.find();
  }

  async findOne(goodsid: number): Promise<GoodsEntity> {
    const goods = await this.goodsRepository.findOne({
      where: { goodsId: goodsid },
    });

    if (!goods) {
      throw new NotFoundException({
        errorMessage: '공연을 찾을 수 없습니다',
      });
    }

    return goods;
  }

  async create(goodsData: GoodsDto): Promise<GoodsEntity> {
    const goods = this.goodsRepository.create(goodsData);

    await this.goodsRepository.save(goods);
    return goods;
  }

  async patch(goodsid: number, updateData: updateGoodsDto) {
    const updateTarget = await this.goodsRepository.findOne({
      where: { goodsId: goodsid },
    });

    if (!updateTarget) {
      throw new NotFoundException({
        errorMessage: '공연을 찾을 수 없습니다',
      });
    }

    // 오른쪽의 속성을 왼쪽의 엔티티에 복사한다.
    Object.assign(updateTarget, updateData);

    // 왜 이렇게 작성하였는가?
    // MySQL 처럼 모든 속성들을 다 가져와서 하나씩 수정하기에는 번거로움이 있다.
    // 또한, 결과값이 어떤 것을 수정했는지에 대한 정보가 보이지 않아서 불편함이 있다.

    const updateGoods = await this.goodsRepository.save(updateTarget);
    return updateGoods;
  }

  async remove(goodsid: number): Promise<boolean> {
    const deleteTarget = await this.goodsRepository.delete({
      goodsId: goodsid,
    });

    if (!deleteTarget) {
      throw new NotFoundException({
        errorMessage: '공연을 찾을 수 없습니다',
      });
    }

    return deleteTarget.affected > 0;
  }
}
