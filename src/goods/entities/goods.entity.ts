// import { UserEntity } from 'src/auth/entities/user.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  //   OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class GoodsEntity {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  adminId: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  content: string;

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
}
