// пользователь

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { UserRole } from './types';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Length(3)
  login: string;

  @Column()
  @Length(8)
  password: string;

  @Column()
  @Length(1)
  surname: string;

  @Column()
  @Length(1)
  name: string;

  @Column()
  @Length(1)
  patronymic: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  token: string;
}
