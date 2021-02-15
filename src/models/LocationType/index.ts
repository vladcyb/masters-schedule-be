// тип локации

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class LocationType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;
}
