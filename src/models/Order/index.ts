// заказы

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Master from '../Master';
import User from '../User';
import { OrderStatus } from './types';
import Service from '../Service';

@Entity()
export default class Order {
  // ID
  @PrimaryGeneratedColumn()
  id: number;

  // ID мастера
  @OneToOne(() => Master)
  @JoinColumn()
  master: Master;

  // ID клиента
  @ManyToOne(() => User)
  @JoinColumn()
  client: User;

  // описание
  @Column()
  description: string;

  // дата начала
  @Column({ nullable: true })
  startDate: Date;

  // дата окончания
  @Column({ nullable: true })
  finishDate: Date;

  // статус
  @Column()
  status: OrderStatus;

  // комментарий
  @Column({ nullable: true })
  comment: string;

  // фотографии
  @Column()
  photo: string;

  // каталог услуг
  @OneToOne(() => Service)
  @JoinColumn()
  service: number;

  // адрес
  @Column()
  address: string;
}
