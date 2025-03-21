import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { InventorySchemaModule } from '@/schemas/inventory.schema';
import { ItemSchemaModule } from '@/schemas/item.schema';
import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    InventorySchemaModule,
    ItemSchemaModule,
    AppUserSchemaModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService, InventorySchemaModule, ItemSchemaModule, AppUserSchemaModule],
})
export class InventoryModule {}
