import { ProductsModule } from '@/products/products.module';
import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { CompanySchemaModule } from '@/schemas/company.schema';
import { InventorySchemaModule } from '@/schemas/inventory.schema';
import { WarehouseLocationSchemaModule } from '@/schemas/warehouse-location.schema';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';

@Module({
  imports: [
    CompanySchemaModule,
    AppUserSchemaModule,
    InventorySchemaModule,
    ProductsModule,
    WarehouseLocationSchemaModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
