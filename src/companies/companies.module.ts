import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompanySchemaModule } from '@/schemas/company.schema';
import { UsersModule } from '@/users/users.module';
import { WarehouseLocationSchemaModule } from '@/schemas/warehouse-location.schema';

@Module({
  imports: [CompanySchemaModule, UsersModule, WarehouseLocationSchemaModule],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
