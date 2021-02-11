// локация

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Location)
  @JoinColumn()
  parent: Location;

  @Column({ nullable: false })
  title: string;
}
