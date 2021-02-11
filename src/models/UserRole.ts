// роль

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  permissions: number;
}
