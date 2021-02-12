// специализация

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
export default class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  title: string;

  @Column()
  @Length(10, 200)
  icon: string;
}
