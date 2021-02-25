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
  price: string;

  // длительность
  @Column({ nullable: true })
  duration: string;

  // специализация
  @ManyToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
