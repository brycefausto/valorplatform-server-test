import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ItemReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: string;

  @Column()
  itemName: string;

  @Column()
  size: string;

  @Column()
  quantity: number;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;
}
