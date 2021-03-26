// каталог услуг

import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Specialization from '../Specialization';

@Entity()
export default class Service {
  // ID
  @PrimaryGeneratedColumn()
  id: number;

  // название
  @Column()
  title: string;

  // стоимость
  @Column()
  price: number;

  // длительность (в часах)
  @Column({ nullable: true })
  duration: number;

  // специализация
  @ManyToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
