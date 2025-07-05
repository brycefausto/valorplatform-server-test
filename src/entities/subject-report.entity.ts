import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SubjectReport {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  subjectId: string;

  @Column()
  subjectName: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
