import { UserEntity } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class GoodsEntity {
  @PrimaryGeneratedColumn()
  goodsId: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  price: number;

  @Column()
  imgUrl: string;

  @Column()
  showDate: Date;

  @Column()
  bookingLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.goods, {
    cascade: true,
    eager: false, // 관계가 항상 자동으로 로드안되게
  })
  user: UserEntity;
}
