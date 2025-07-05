import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReportType {
  ITEM = 'item',
  ITEM_COUNT = 'item_count',
  SUBJECT = 'subject',
  DEPARTMENT = 'department',
  DEPARTMENT_LOST_ITEMS = 'department_lost_items',
}

@Entity()
export class ReportData {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: ReportType;

  @Column({ default: false })
  isUpdated: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
