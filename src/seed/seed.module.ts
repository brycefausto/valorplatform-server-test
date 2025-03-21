import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { IDCounterSchemaModule } from '@/schemas/id-counter.schema';
import { ItemSchemaModule } from '@/schemas/item.schema';
import { TransactionSchemaModule } from '@/schemas/transaction.schema';
import { TransactionItemSchemaModule } from '@/schemas/transactionitem.schema';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { InventorySchemaModule } from '@/schemas/inventory.schema';

@Module({
  imports: [
    AppUserSchemaModule,
    ItemSchemaModule,
    TransactionSchemaModule,
    TransactionItemSchemaModule,
    IDCounterSchemaModule,
    InventorySchemaModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
