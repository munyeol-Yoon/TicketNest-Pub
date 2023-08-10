import { Test, TestingModule } from '@nestjs/testing';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

describe('GoodsController', () => {
  let goodsController: GoodsController;
  let goodsService: GoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsController],
      providers: [GoodsService],
    }).compile();

    goodsController = module.get<GoodsController>(GoodsController);
    goodsService = module.get<GoodsService>(GoodsService);
  });

  it('should be defined', () => {
    expect(goodsController).toBeDefined();
  });

  describe('findAll', () => {
    it('공연 전체 목록을 조회할 수 있는가?', async () => {
      const goods = [
        {
          userId: 1,
          title: '아이유 콘서트',
          content: '아이유 콘서트인데 설명이 더 필요해?',
          price: 100000,
          imgUrl: 'http://',
          showDate: '2023-08-09',
          bookingLimit: 300,
        },
        {
          userId: 1,
          title: 'YOASOBI 콘서트',
          content: '새벽을 버텨냈다',
          price: 70000,
          imgUrl: 'http://',
          showDate: '2023-08-09',
          bookingLimit: 100,
        },
      ]; //TODO: 작성방법?

      jest.spyOn(goodsService, 'findAll').mockResolvedValue(goods);
      expect(await goodsController.findAll()).toBe(goods);
    });
  });

  describe('findOne', () => {
    it('특정 공연을 조회할 수 있는가?', async () => {
      const goods = {
        userId: 1,
        title: '아이유 콘서트',
        content: '아이유 콘서트인데 설명이 더 필요해?',
        price: 100000,
        imgUrl: 'http://',
        showDate: '2023-08-09',
        bookingLimit: 300,
      }; //TODO: 작성방법?

      jest.spyOn(goodsService, 'findOne').mockResolvedValue(goods);
      expect(await goodsController.findOne()).toBe(goods);
    });
  });
});
