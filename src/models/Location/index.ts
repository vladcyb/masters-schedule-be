// локация

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent,
} from 'typeorm';
import LocationType from '../LocationType';

@Entity()
@Tree('nested-set')
export default class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @TreeParent()
  parent: Location;

  @TreeChildren()
  children: Location[];

  @Column()
  title: string;

  @Column()
  coordinates: string;

  @ManyToOne(() => LocationType)
  @JoinColumn()
  type: LocationType;
}
