import { ENV } from '@/constants';
import { ProductsService } from '@/products/products.service';
import { AppUser, AppUserDocument } from '@/schemas/appuser.schema';
import { Company, CompanyDocument } from '@/schemas/company.schema';
import { Inventory, InventoryDocument } from '@/schemas/inventory.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createCompanyData } from './company.seed';
import { createProductsData } from './product.seed';
import { createSuperAdminData, createUserData } from './users.seed';
import { WarehouseLocation, WarehouseLocationDocument } from '@/schemas/warehouse-location.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(AppUser.name) private appUserModel: Model<AppUserDocument>,
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    @InjectModel(WarehouseLocation.name)
    private locationModel: Model<WarehouseLocationDocument>,
    private productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await createSuperAdminData(this.appUserModel);
    if (ENV !== 'production') {
      const company = await createCompanyData(this.companyModel, this.locationModel);
      await createUserData(this.appUserModel, company);
      await createProductsData(
        this.productsService,
        this.appUserModel,
        company,
      );
      await this.migrateItems();
    }
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
