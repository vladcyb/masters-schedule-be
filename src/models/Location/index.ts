// локация

import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  coordinates: string;

  @OneToOne(() => LocationType)
  @JoinColumn()
  type: LocationType;
}
