import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
} from 'typeorm';

import { Report } from '../reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    // console.log('Insert User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    // console.log('Remove User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    // console.log('Update User with id', this.id);
  }
}
