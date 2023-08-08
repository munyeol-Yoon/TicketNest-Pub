// import { UserEntity } from 'src/auth/entities/user.entity';
import { BookingEntity } from 'src/booking/entity/booking.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
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
    eager: false,
  })
  user: UserEntity;

  @OneToMany(() => BookingEntity, (booking) => booking.goods)
  booking: BookingEntity[];
}
