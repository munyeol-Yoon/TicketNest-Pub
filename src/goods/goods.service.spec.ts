import { Test, TestingModule } from '@nestjs/testing';
import { GoodsService } from './goods.service';
import { GoodsEntity } from './entities/goods.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('GoodsService', () => {
  let goodsService: GoodsService;
  let goodsRepository: Repository<GoodsEntity>;

  //TODO: beforeEach 부분을 제대로 이해하지 못하고 있다.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoodsService,
        {
          provide: getRepositoryToken(GoodsEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    goodsService = module.get<GoodsService>(GoodsService);
    goodsRepository = module.get<Repository<GoodsEntity>>(
      getRepositoryToken(GoodsEntity),
    );
  });

  describe('findAll', () => {
    it('공연 전체 목록을 조회할 수 있는가?', async () => {
      const mockGoods: GoodsEntity[]; //TODO: 작성방법?
      jest.spyOn(goodsRepository, 'find').mockResolvedValue(mockGoods);

      const goods = await goodsService.findAll();

      expect(goods).toEqual(mockGoods);
    });
  });

  describe('findOne', () => {
    it('특정 공연을 조회할 수 있는가?', async () => {
      const goodsid = 1;
      const mockGoods: GoodsEntity = {}; //TODO: 작성방법?
      jest.spyOn(goodsRepository, 'findOne').mockResolvedValue(mockGoods);

      const goods = await goodsService.findOne(goodsid);

      expect(goods).toEqual(mockGoods);
    });

    it('특정 공연을 조회할 수 없으면 NotFoundException을 return 하는가?', async () => {
      jest.spyOn(goodsRepository, 'findOne').mockResolvedValue(undefined);

      await expect(goodsService.findOne()).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('새로운 공연 정보를 등록할 수 있는가?', async () => {
      const createData = {}; //TODO: 작성방법?
      const mockCreatedGoods: GoodsEntity = {}; //TODO: 작성방법?

      jest.spyOn(goodsRepository, 'create').mockReturnValue(mockCreatedGoods);
      jest.spyOn(goodsRepository, 'save').mockResolvedValue(mockCreatedGoods);

      const goods = await goodsService.create(createData);

      expect(goods).toEqual(mockCreatedGoods);
    });
  });

  describe('patch', () => {
    it('공연 정보를 수정할 수 있는가?', async () => {
      const goodsid = 1;
      const updateData = {};

      const mockExistGoods: GoodsEntity = {}; //TODO: 작성방법?
      const mockUpdateGoods: GoodsEntity = {}; //TODO: 작성방법?

      jest.spyOn(goodsRepository, 'findOne').mockResolvedValue(mockExistGoods);
      jest.spyOn(goodsRepository, 'save').mockResolvedValue(mockUpdateGoods);

      const updateGoods = await goodsService.patch(goodsid, updateData);

      expect(updateGoods).toEqual(mockUpdateGoods);
    });

    it('수정할 공연 정보가 없으면 NotFoundException을 return 하는가?', async () => {
      jest.spyOn(goodsService, 'findOne').mockResolvedValue(undefined);

      await expect(goodsService.patch()).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('공연 정보를 삭제할 수 있는가?', async () => {
      const goodsid = 1;
      const mockDeleteGoods = { affected: 1 };
      jest.spyOn(goodsRepository, 'delete').mockResolvedValue(mockDeleteGoods);

      const deleteGoods = await goodsService.remove(goodsid);

      expect(deleteGoods).toBe(true);
    });

    it('삭제할 공연 정보가 없으면 NotFoundException을 return 하는가?', async () => {
      const mockDeleteGoods = { affected: 0 };
      jest.spyOn(goodsRepository, 'delete').mockResolvedValue(mockDeleteGoods);

      await expect(goodsRepository.remove()).rejects.toThrow(NotFoundException);
    });
  });
});
