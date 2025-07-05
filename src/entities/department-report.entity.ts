import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class DepartmentReport {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  departmentId: string;

  @Column()
  departmentName: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
