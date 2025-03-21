import { ItemsService } from '@/items/items.service';
import { AppUser, AppUserDocument, UserRole } from '@/schemas/appuser.schema';
import { InventoryItem, InventoryDocument } from '@/schemas/inventory.schema';
import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import {
  CreateInventoryItemDto,
  InventoryItemDto,
  InventoryQueryParams,
  UpdateInventoryItemDto,
} from './inventory.dto';
import { Item, ItemDocument } from '@/schemas/item.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryModel: PaginateModel<InventoryDocument>,
    @InjectModel(Item.name)
    private itemModel: PaginateModel<ItemDocument>,
    @InjectModel(AppUser.name)
    private appUserModel: PaginateModel<AppUserDocument>,
  ) { }

  async create(createDto: CreateInventoryItemDto) {
    const vendor = await this.appUserModel.findById(createDto.vendorId);

    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }

    const item = await this.itemModel.findById(createDto.itemId);

    if (!item) {
      throw new NotFoundException('Item not found.');
    }

    const existingInventory = await this.inventoryModel.findOne({ item: createDto.itemId, vendor: createDto.vendorId, variantName: createDto.variantName });

    if (existingInventory) {
      existingInventory.stock += createDto.stock
      existingInventory.price = createDto.price

      return existingInventory.save()
    }

    const inventory = new this.inventoryModel({
      ...omit(createDto, ['itemId', 'vendorId']),
      item,
      vendor,
    });
    return inventory.save();
  }

  async update(id: string, updateDto: UpdateInventoryItemDto) {
    return this.inventoryModel
      .findByIdAndUpdate(id, omit(updateDto, ['itemId', 'vendorId']), {
        new: true,
      })
      .exec();
  }

  async findAll(queryParams: InventoryQueryParams) {
    const { page, limit = 10, category, search } = queryParams;
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
        ],
      };
    }

    const emptyItem: any = {
      id: 'null',
      name: 'Deleted Item',
      brand: '',
      description: '',
      itemVariants: [],
    };
    const emptyUser: any = {
      id: 'null',
      name: 'Deleted User',
      role: UserRole.NONE,
    };

    const inventoriesData = await this.inventoryModel.paginate<any>(query, {
      page,
      limit,
    });

    const inventoryDtos = inventoriesData.docs.map((inventory) => {
      if (!inventory.item) {
        inventory.item = emptyItem;
      }

      if (!inventory.vendor) {
        inventory.vendor = emptyUser;
      }

      return new InventoryItemDto(inventory);
    });

    return { ...omit(inventoriesData, 'docs'), docs: inventoryDtos };
  }

  async search(queryString: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    console.log('searching');
    return this.inventoryModel
      .find({
        $or: [{ name: queryRegex }, { brand: queryRegex }],
      })
      .limit(10)
      .exec();
  }

  async countReport() {
    const allCount = await this.inventoryModel.countDocuments();
    const toolsCount = await this.inventoryModel
      .find({ category: 'tool' })
      .countDocuments();
    const consumablesCount = await this.inventoryModel
      .find({ category: 'consumable' })
      .countDocuments();

    return {
      allCount,
      toolsCount,
      consumablesCount,
    };
  }

  async findOne(id: string) {
    return this.inventoryModel.findById(id).exec();
  }

  async delete(id: string) {
    return await this.inventoryModel.findByIdAndDelete(id).exec();
  }
}
