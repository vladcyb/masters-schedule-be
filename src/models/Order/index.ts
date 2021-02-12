// заказы

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Master from '../Master';
import User from '../User';
import { OrderStatus } from './types';
import ServiceList from '../ServiceList';

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
  @OneToOne(() => User)
  @JoinColumn()
  client: User;

  // описание
  @Column({ nullable: false })
  description: string;

  // дата начала
  @Column({ nullable: false })
  startDate: Date;

  // дата окончания
  @Column({ nullable: false })
  finishDate: Date;

  // статус
  @Column({ nullable: false })
  status: OrderStatus;

  // цвет статуса
  @Column({ nullable: false })
  statusColor: string;

  // комментарий
  @Column()
  comment: string;

  // фотографии
  @Column({ nullable: false })
  photo: string;

  // каталог услуг
  @OneToOne(() => ServiceList)
  @JoinColumn()
  serviceList: number;
}
