// тип локации

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class LocationType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;
}
