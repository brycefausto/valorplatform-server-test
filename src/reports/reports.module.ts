import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ProductsModule } from '@/products/products.module';
import { InventoryModule } from '@/inventory/inventory.module';
import { OrdersModule } from '@/orders/orders.module';
import { UsersModule } from '@/users/users.module';
import { CompaniesModule } from '@/companies/companies.module';

@Module({
  imports: [UsersModule, CompaniesModule, ProductsModule, InventoryModule, OrdersModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
