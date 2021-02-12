// каталог услуг

import {
  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Specialization from '../Specialization';

@Entity()
export default class ServiceList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: string;

  @Column()
  duration: number;

  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
