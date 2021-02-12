// мастер

import {
  Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import Location from './Location';
import Specialization from './Specialization';

@Entity()
export default class Master {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
