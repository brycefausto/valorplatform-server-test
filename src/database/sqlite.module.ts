import { DepartmentLostItemsReport } from '@/entities/department-lost-items-report.entity';
import { DepartmentReport } from '@/entities/department-report.entity';
import { ItemCountReport } from '@/entities/item-count-report.entity';
import { ItemReport } from '@/entities/item-report.entity';
import { ReportData } from '@/entities/report-data';
import { SubjectReport } from '@/entities/subject-report.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/db.sqlite',
      synchronize: true,
      entities: [
        ReportData,
        ItemReport,
        ItemCountReport,
        SubjectReport,
        DepartmentReport,
        DepartmentLostItemsReport,
      ],
    }),
  ],
})
export class SQLiteModule {}
