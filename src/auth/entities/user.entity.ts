// 데이터 베이스 모델 생성 장소

// import { GoodsEntity } from 'src/goods/entities/goods.entity';
import { BookingEntity } from 'src/booking/entity/booking.entity';
import { GoodsEntity } from '../../goods/entities/goods.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GoodsEntity, (goods) => goods.user)
  goods: GoodsEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  booking: BookingEntity[];
}
