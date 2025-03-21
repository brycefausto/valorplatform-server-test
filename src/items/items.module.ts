import { InventoryModule } from '@/inventory/inventory.module';
import { ItemSchemaModule } from '@/schemas/item.schema';
import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [
    ItemSchemaModule,
    InventoryModule,
  ],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule { }
