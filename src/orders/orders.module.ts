import { InventoryModule } from '@/inventory/inventory.module';
import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { CompanySchemaModule } from '@/schemas/company.schema';
import { CustomerSchemaModule } from '@/schemas/customer.schema';
import { OrderItemSchemaModule } from '@/schemas/order-item.schema';
import { OrderSchemaModule } from '@/schemas/order.schema';
import { PaymentSchemaModule } from '@/schemas/payment.schema';
import { ProductVariantSchemaModule } from '@/schemas/product-variant.schema';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BankAccountSchemaModule } from '@/schemas/bank-account.schema';

@Module({
  imports: [
    OrderSchemaModule,
    OrderItemSchemaModule,
    PaymentSchemaModule,
    ProductVariantSchemaModule,
    AppUserSchemaModule,
    CompanySchemaModule,
    CustomerSchemaModule,
    BankAccountSchemaModule,
    InventoryModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
