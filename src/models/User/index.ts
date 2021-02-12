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

  @Column({ unique: true, nullable: false })
  @Length(3)
  login: string;

  @Column({ nullable: false })
  @Length(1)
  surname: string;

  @Column({ nullable: false })
  @Length(1)
  name: string;

  @Column({ nullable: false })
  @Length(1)
  patronymic: string;

  @Column({ nullable: false })
  role: UserRole;
}
