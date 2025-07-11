import { UserPayload } from '@/auth/auth.dto';
import { AppUser, AppUserDocument } from '@/schemas/appuser.schema';
import { Company, CompanyDocument } from '@/schemas/company.schema';
import { Inventory, InventoryDocument } from '@/schemas/inventory.schema';
import {
  ProductVariant,
  ProductVariantDocument,
} from '@/schemas/product-variant.schema';
import { Product, ProductDocument } from '@/schemas/product.schema';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { merge, omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import {
  CreateProductDto,
  ProductDto,
  ProductQueryParams,
  UpdateProductDto,
  UpdateProductImageDto,
  ViewProductDto,
} from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: PaginateModel<ProductDocument>,
    @InjectModel(ProductVariant.name)
    private productVariantModel: PaginateModel<ProductVariantDocument>,
    @InjectModel(AppUser.name)
    private appUserModel: PaginateModel<AppUserDocument>,
    @InjectModel(Company.name)
    private companyModel: PaginateModel<CompanyDocument>,
    @InjectModel(Inventory.name)
    private inventoryModel: PaginateModel<InventoryDocument>,
  ) {}

  async create(createDto: CreateProductDto, user: UserPayload) {
    if (!createDto.variants || createDto.variants.length == 0) {
      throw new BadRequestException('Required at least one product variant.');
    }

    for (let variantDto of createDto.variants) {
      const existingVariant = await this.productVariantModel.findOne({
        sku: variantDto.sku,
      });
      if (existingVariant) {
        throw new ConflictException('The SKU already exists');
      }
    }

    let company =
      user.company ?? (await this.companyModel.findById(createDto.companyId));

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    let product = await this.productModel.create(
      merge(omit(createDto, 'companyId', 'vendorId', 'variants'), {
        company,
      }),
    );

    let variants: ProductVariant[] = [];

    try {
      for (let [i, variantDto] of createDto.variants.entries()) {
        const variant = await this.productVariantModel.create(
          merge(omit(variantDto, 'stock'), {
            productId: product.id,
            sequence: i,
          }),
        );
        variant.stock = variantDto.stock;
        variant.minStock = variantDto.minStock;
        variant.maxStock = variantDto.maxStock;
        await this.inventoryModel.create({
          product: product.id,
          variant: variant.id,
          vendor: user.id,
          company: company,
          stock: variantDto.stock,
          minStock: variantDto.minStock,
          maxStock: variantDto.maxStock,
          price: variant.price,
          isCompanyInventory: true,
        });

        variants.push(variant);
      }
    } catch (error) {
      throw new Error(error.message);
    }

    product.defaultVariant = variants[0];
    product.price = variants[0].price;
    product.variants = variants;

    return new ProductDto(await product.save(), variants);
  }

  async update(id: string, updateDto: UpdateProductDto) {
    let product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (!updateDto.variants || updateDto.variants.length == 0) {
      throw new BadRequestException('Required at least one product variant.');
    }

    for (let variantDto of updateDto.variants) {
      const existingVariant = await this.productVariantModel
        .findOne({
          product: { $ne: product.id },
          sku: variantDto.sku,
        })
        .populate('product');
      if (existingVariant) {
        throw new ConflictException('The SKU already exists');
      }
    }

    product = merge(product, {
      ...omit(updateDto, 'vendorId', 'variants', 'deletedVariantIds'),
    });

    const updatedVariants: ProductVariant[] = [];

    await this.inventoryModel.deleteMany({
      variant: { $in: updateDto.deletedVariantIds },
    });
    await this.productVariantModel.deleteMany({
      _id: { $in: updateDto.deletedVariantIds },
    });

    try {
      for (let [i, variantDto] of updateDto.variants.entries()) {
        const updateVariantData = merge(omit(variantDto, 'id', 'stock'), {
          sequence: i,
        });
        const variant = variantDto.id
          ? await this.productVariantModel
              .findByIdAndUpdate(variantDto.id, updateVariantData, {
                new: true,
              })
              .exec()
          : await this.productVariantModel.create(
              merge(updateVariantData, { product }),
            );

        if (variant) {
          const inventoryItem = await this.inventoryModel
            .findOne({ variant, isCompanyInventory: true })
            .exec();
          if (inventoryItem) {
            inventoryItem.stock = variantDto.stock;
            await inventoryItem.save();
          } else {
            await this.inventoryModel.create({
              variant,
              stock: variantDto.stock,
              minStock: variantDto.minStock,
              maxStock: variantDto.minStock,
              isCompanyInventory: true,
            });
          }
          variant.stock = variantDto.stock;
          variant.minStock = variantDto.minStock;
          variant.maxStock = variantDto.maxStock;
          updatedVariants.push(variant as ProductVariant);
        }
      }
    } catch (error: any) {
      console.log('error: ', error.message);
      throw new Error(error.message);
    }

    product.defaultVariant = updatedVariants[0];
    product.price = updatedVariants[0].price;
    product.variants = updatedVariants;

    const newProduct = await product.save();

    return new ProductDto(newProduct, updatedVariants);
  }

  async updateImage(id: string, updateDto: UpdateProductImageDto) {
    let product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (updateDto.image) {
      product.image = updateDto.image;
    }

    return await product.save();
  }

  async updateVariantImage(id: string, updateDto: UpdateProductImageDto) {
    let productVariant = await this.productVariantModel.findById(id);

    if (!productVariant) {
      throw new NotFoundException('Product Variant not found.');
    }

    if (updateDto.image) {
      productVariant.image = updateDto.image;
    }

    productVariant = await productVariant.save();
  }

  async findAll(queryParams: ProductQueryParams) {
    const { page, limit = 10, companyId, category, search } = queryParams;

    let query: any = {};

    if (companyId) {
      query.company = companyId;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        company: companyId,
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
        ],
      };
    }

    return await this.productModel.paginate(query, {
      page,
      limit,
      sort: { createdAt: 'desc' },
    });
  }

  async search(queryString: string, companyId: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    console.log('searching');
    const products = await this.productModel
      .find({
        company: companyId,
        $or: [{ name: queryRegex }, { brand: queryRegex }],
      })
      .limit(10)
      .exec();

    const productDtos = await Promise.all(
      products.map(async (product) => {
        const variants = await this.productVariantModel.find({ product });
        return new ProductDto(product, variants);
      }),
    );

    return productDtos;
  }

  async findOne(id: string, vendorId?: string) {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const variants = await this.productVariantModel.find({ productId: id });
    const variantIds = variants.map((it) => it.id);
    const inventoriesQuery: any = {
      variant: { $in: variantIds },
    };
    if (vendorId) {
      inventoriesQuery.vendor = vendorId;
    }
    const inventories = await this.inventoryModel.find(inventoriesQuery);

    return new ViewProductDto(product, variants, inventories);
  }

  async count(companyId: string) {
    return this.productModel.countDocuments({ company: companyId });
  }

  async delete(id: string) {
    const products = await this.productModel.find({ info: id }).exec();

    for (const product of products) {
      await this.inventoryModel
        .findOneAndDelete({ variant: product.id })
        .exec();
      await product.deleteOne();
    }

    return await this.productModel.findByIdAndDelete(id).exec();
  }
}
