import { AppUser, AppUserDocument } from '@/schemas/appuser.schema';
import { IDCounter, IDCounterDocument } from '@/schemas/id-counter.schema';
import { Item, ItemDocument } from '@/schemas/item.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createUserData } from './users.seed';
import { createItemData } from './items.seed';
import { ItemsService } from '@/items/items.service';
import { InventoryDocument, InventoryItem } from '@/schemas/inventory.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(AppUser.name) private appUserModel: Model<AppUserDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectModel(IDCounter.name)
    private idCounterModel: Model<IDCounterDocument>,
    @InjectModel(InventoryItem.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  async onModuleInit() {
    // await createIDCounterData(this.idCounterModel);
    await createUserData(this.appUserModel);
    await createItemData(this.itemModel, this.appUserModel, this.inventoryModel);
    await this.migrateItems();
  }

  async migrateItems() {
    // const items = await this.itemModel.find().exec();
    // items.forEach(item => {
    //   if (!item.itemSizes || item.itemSizes.length == 0) {
    //     item.itemSizes = [{ size: item.size, stock: item.stock }];
    //   }
    //   delete item.size;
    //   delete item.stock;
    // })
    // await this.itemModel.bulkSave(items);
    // const transactions = await this.transactionModel.find().exec();
    // transactions.map(transaction => {
    //   const remarks = new Set<string>()
    //   transaction.items.forEach(transactItem => {
    //     if (transactItem.remarks) {
    //       remarks.add(transactItem.remarks);
    //     }
    //   })
    //   if (remarks.size > 0) {
    //     transaction.itemRemarks = [...remarks];
    //   }
    //   return transaction;
    // });
    // await this.transactionModel.bulkSave(transactions);
  }
}
