import { AppUser, AppUserDocument, UserRole } from '@/schemas/appuser.schema';
import { Inventory, InventoryDocument } from '@/schemas/inventory.schema';
import {
  ProductVariant,
  ProductVariantDocument,
} from '@/schemas/product-variant.schema';
import { Product, ProductDocument } from '@/schemas/product.schema';
import {
  WarehouseLocation,
  WarehouseLocationDocument,
} from '@/schemas/warehouse-location.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { merge, omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import {
  CreateInventoryDto,
  InventoryDto,
  InventoryQueryParams,
  UpdateInventoryDto,
} from './inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: PaginateModel<InventoryDocument>,
    @InjectModel(Product.name)
    private productModel: PaginateModel<ProductDocument>,
    @InjectModel(ProductVariant.name)
    private productVariantModel: PaginateModel<ProductVariantDocument>,
    @InjectModel(AppUser.name)
    private appUserModel: PaginateModel<AppUserDocument>,
    @InjectModel(WarehouseLocation.name)
    private locationModel: PaginateModel<WarehouseLocationDocument>,
  ) {}

  async create(createDto: CreateInventoryDto) {
    const vendor = await this.appUserModel.findById(createDto.vendorId);

    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }

    if (!vendor.company) {
      throw new NotFoundException('Vendor does not have company.');
    }

    const productVariant = await this.productVariantModel.findById(
      createDto.variantId,
    );

    if (!productVariant) {
      throw new NotFoundException('Product Variant not found.');
    }

    const existingInventory = await this.inventoryModel.findOne({
      variant: createDto.variantId,
      vendor: createDto.vendorId,
    });

    if (existingInventory) {
      existingInventory.stock += createDto.stock;
      existingInventory.set({
        price: createDto.price,
        stock: createDto.stock,
        minStock: createDto.minStock,
        maxStock: createDto.maxStock,
      });

      return existingInventory.save();
    }

    const location = await this.locationModel.findOne({
      company: vendor.company?.id,
    });

    const createInventoryDto: any = {
      ...omit(createDto, ['variantId', 'vendorId']),
      variant: productVariant,
      vendor,
      location,
    };

    if (vendor.role == UserRole.ADMIN) {
      createInventoryDto.isCompanyInventory = true;
    }

    const inventory = new this.inventoryModel(createInventoryDto);
    return inventory.save();
  }

  async update(id: string, updateDto: UpdateInventoryDto) {
    const location = await this.locationModel.findOne({
      company: updateDto.locationId,
    });

    const updateData = merge(
      omit(updateDto, ['variantId', 'vendorId', 'locationId']),
      { location },
    );

    return await this.inventoryModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
      })
      .exec();
  }

  async findAll(queryParams: InventoryQueryParams) {
    const { page, limit = 10, companyId, category, search } = queryParams;

    if (!companyId) {
      throw new BadRequestException('The companyId param is required.');
    }

    let query: any = { company: companyId };

    if (category) {
      query.category = category;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        ...query,
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
        ],
      };
    }

    const emptyVariant: any = {
      id: 'null',
      name: 'Deleted Product Variant',
      sku: '',
      description: '',
      product: '',
      stock: 0,
      minStock: 0,
      maxStock: 0,
      price: 0,
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

    const productMap = new Map<string, Product | null | undefined>();

    const inventoryDtos = await Promise.all(
      inventoriesData.docs.map(async (inventory) => {
        if (!inventory.variant) {
          inventory.variant = emptyVariant;
        }

        if (!inventory.vendor) {
          inventory.vendor = emptyUser;
        }

        const productId = inventory.variant?.productId;
        let product: Product | undefined | null;

        if (productId) {
          product = productMap.get(productId.toString());

          if (!product) {
            product = await this.productModel.findById(productId);
            productMap.set(productId.toString(), product);
          }
        }

        return new InventoryDto(inventory, product as Product);
      }),
    );

    return { ...omit(inventoriesData, 'docs'), docs: inventoryDtos };
  }

  async search(queryString: string, companyId: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    console.log('searching');
    return this.inventoryModel
      .find({
        company: companyId,
        $or: [{ name: queryRegex }, { brand: queryRegex }],
      })
      .limit(10)
      .exec();
  }

  async count(vendorId: string) {
    return this.inventoryModel.countDocuments({ vendor: vendorId });
  }

  async countLowStock(vendorId: string) {
    return this.inventoryModel.countDocuments({
      vendor: vendorId,
      $expr: { $lte: ['$stock', '$minStock'] },
    });
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
    const inventory = await this.inventoryModel.findById(id).exec();

    if (!inventory) {
      throw new NotFoundException('Inventory not found.');
    }

    const product = await this.productModel.findById(
      inventory?.variant?.productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return new InventoryDto(inventory, product);
  }

  async decreaseStock(variantId: string, stock: number) {
    const inventory = await this.inventoryModel
      .findOne({ variant: variantId })
      .exec();

    if (!inventory) {
      throw new NotFoundException('Inventory not found.');
    }

    if (stock > inventory.stock) {
      throw new BadRequestException('Inventory out of stock.');
    }

    inventory.stock = inventory.stock - stock;

    await inventory.save();
  }

  async delete(id: string) {
    return await this.inventoryModel.findByIdAndDelete(id).exec();
  }
}
