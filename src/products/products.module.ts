import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { InventorySchemaModule } from '@/schemas/inventory.schema';
import { ProductVariantSchemaModule } from '@/schemas/product-variant.schema';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchemaModule } from '@/schemas/product.schema';
import { CompanySchemaModule } from '@/schemas/company.schema';

@Module({
  imports: [
    ProductSchemaModule,
    ProductVariantSchemaModule,
    AppUserSchemaModule,
    CompanySchemaModule,
    InventorySchemaModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
