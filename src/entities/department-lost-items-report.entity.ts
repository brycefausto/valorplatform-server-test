import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class DepartmentLostItemsReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departmentId: string;

  @Column()
  departmentName: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
