import { GoodsEntity } from 'src/goods/entities/goods.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
export default class GoodsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(GoodsEntity);

    await repository.insert([
      {
        userId: 1,
        title: '아이유 워터밤',
        content: '아이유 워터밤 한다 빨리 와라',
        price: 10000,
        imgUrl: 'http:',
        showDate: '2022-12-30',
        bookingLimit: 500,
      },
    ]);
  }
}
