// локация

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import LocationType from '../LocationType';

@Entity()
export default class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Location)
  @JoinColumn()
  parent: Location;

  @Column()
  title: string;

  @Column()
  coordinates: string;

  @ManyToOne(() => LocationType)
  @JoinColumn()
  type: LocationType;
}
