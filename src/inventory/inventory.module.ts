import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { InventorySchemaModule } from '@/schemas/inventory.schema';
import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { ProductSchemaModule } from '@/schemas/product.schema';
import { ProductVariantSchemaModule } from '@/schemas/product-variant.schema';
import { WarehouseLocationSchemaModule } from '@/schemas/warehouse-location.schema';

@Module({
  imports: [
    InventorySchemaModule,
    ProductSchemaModule,
    ProductVariantSchemaModule,
    AppUserSchemaModule,
    WarehouseLocationSchemaModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [
    InventoryService,
    InventorySchemaModule,
    ProductSchemaModule,
    ProductVariantSchemaModule,
    AppUserSchemaModule,
    WarehouseLocationSchemaModule,
  ],
})
export class InventoryModule {}
