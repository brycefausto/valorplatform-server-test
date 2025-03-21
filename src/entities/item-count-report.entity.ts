import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ItemCountReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;
}
