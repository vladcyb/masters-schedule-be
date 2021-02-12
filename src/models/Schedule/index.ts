// расписания

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Master from '../Master';

@Entity()
export default class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Master)
  @JoinColumn()
  master: Master;

  @Column()
  hours: string;

  @Column()
  status: number;
}
