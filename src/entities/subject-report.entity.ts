import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SubjectReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subjectId: string;

  @Column()
  subjectName: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
