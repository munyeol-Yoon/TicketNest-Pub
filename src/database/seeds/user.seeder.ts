import { UserEntity } from 'src/auth/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    await repository.insert([
      {
        email: 'test@test.com',
        password: '11111111',
        nickname: 'test',
      },
    ]);
  }
}
