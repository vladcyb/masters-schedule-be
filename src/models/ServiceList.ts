// каталог услуг

import {
  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Specialization from './Specialization';

@Entity()
export default class ServiceList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: string;

  @Column({ nullable: false })
  duration: number;

  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
