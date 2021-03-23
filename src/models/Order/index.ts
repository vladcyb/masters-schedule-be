// заказы

import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import Service from '../Service';
import Master from '../Master';
import User from '../User';
import { OrderStatus } from './enums';

@Entity()
export default class Order {
  // ID
  @PrimaryGeneratedColumn()
  id: number;

  // ID мастера
  @OneToOne(() => Master, { eager: true })
  @JoinColumn()
  master: Master;

  // ID клиента
  @Column()
  clientId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  // описание
  @Column()
  description: string;

  // дата начала
  @Column({ nullable: true })
  startDate: string;

  // дата окончания
  @Column({ nullable: true })
  finishDate: string;

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
  @ManyToMany(() => Service, { eager: true })
  @JoinTable()
  services: Service[];

  // адрес
  @Column()
  address: string;
}
