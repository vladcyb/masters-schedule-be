// мастер

import {
  Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../User';
import Location from '../Location';
import Specialization from '../Specialization';

@Entity()
export default class Master {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Location)
  @JoinColumn()
  location: Location;

  @ManyToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
}
