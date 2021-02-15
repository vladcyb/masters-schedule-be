// каталог услуг

import {
  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Specialization from '../Specialization';

@Entity()
export default class ServiceList {
  // ID
  @PrimaryGeneratedColumn()
  id: number;

  // название
  @Column()
  title: string;

  // стоимость
  @Column()
  price: string;

  // длительность
  @Column()
  duration: number;

  // специализация
  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
