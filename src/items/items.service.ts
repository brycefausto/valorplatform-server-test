import { InventoryService } from '@/inventory/inventory.service';
import { Item, ItemDocument } from '@/schemas/item.schema';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit, orderBy } from 'lodash';
import { PaginateModel } from 'mongoose';
import { CreateItemDto, ItemQueryParams, UpdateItemDto } from './items.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: PaginateModel<ItemDocument>,
    @Inject(forwardRef(() => InventoryService))
    private inventoryService: InventoryService,
  ) {}

  async create(createDto: CreateItemDto) {
    let item = new this.itemModel(omit(createDto, "vendorId"));
    item = await item.save();
    for (const variant of item.variants) {
      await this.inventoryService.create({ itemId: item.id, vendorId: createDto.vendorId, variantName: variant.name, stock: 1, price: variant.price })
    }

    return item
  }

  async update(id: string, updateDto: UpdateItemDto) {
    return this.itemModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async findAll(queryParams: ItemQueryParams) {
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

    return await this.itemModel.paginate(query, { page, limit, sort: { createdAt: 'desc' } });
  }

  async search(queryString: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    console.log('searching');
    return this.itemModel
      .find({
        $or: [{ name: queryRegex }, { brand: queryRegex }],
      })
      .limit(10)
      .exec();
  }

  async countReport() {
    const allCount = await this.itemModel.countDocuments();
    const toolsCount = await this.itemModel
      .find({ category: 'tool' })
      .countDocuments();
    const consumablesCount = await this.itemModel
      .find({ category: 'consumable' })
      .countDocuments();

    return {
      allCount,
      toolsCount,
      consumablesCount,
    };
  }

  async findOne(id: string) {
    return this.itemModel.findById(id).exec();
  }

  async delete(id: string) {
    return await this.itemModel.findByIdAndDelete(id).exec();
  }
}
