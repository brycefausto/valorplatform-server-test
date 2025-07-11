import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class CountReport {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;
}
