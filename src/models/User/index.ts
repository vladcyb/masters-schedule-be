// пользователь

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import UserRole from '../UserRole';

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

  @OneToOne(() => UserRole)
  @JoinColumn()
  role: UserRole;
}
