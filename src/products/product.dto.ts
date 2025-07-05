import { Company } from '@/schemas/company.schema';
import { Inventory } from '@/schemas/inventory.schema';
import { ProductVariant } from '@/schemas/product-variant.schema';
import { Product } from '@/schemas/product.schema';

export class ProductDto {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  company?: Company;
  variants: ProductVariantDto[];

  constructor(product: Product, variants: ProductVariant[]) {
    this.id = product.id;
    this.name = product.name;
    this.brand = product.brand;
    this.category = product.category;
    this.description = product.description;
    this.image = product.image;
    this.company = product.company;
    this.variants = variants.map((it) => new ProductVariantDto(it));
  }
}

export class ProductVariantDto {
  id: string;
  name: string;
  sku: string;
  description?: string;
  image?: string;
  price: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;

  constructor(productVariant: ProductVariant) {
    this.id = productVariant.id;
    this.name = productVariant.name;
    this.sku = productVariant.sku;
    this.description = productVariant.description;
    this.image = productVariant.image;
    this.price = productVariant.price;
    this.stock = productVariant.stock;
    this.minStock = productVariant.minStock;
    this.maxStock = productVariant.maxStock;
  }
}

export class CreateProductVariantDto {
  name: string;
  sku: string;
  description?: string;
  image?: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
}

export class UpdateProductVariantDto {
  id: string;
  name: string;
  sku: string;
  description?: string;
  image?: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
}

export class CreateProductDto {
  name: string;
  brand: string;
  category: string;
  description?: string;
  image?: string;
  companyId: string;
  variants: CreateProductVariantDto[];
}

export class UpdateProductDto {
  name: string;
  brand: string;
  category: string;
  description: string;
  image?: string;
  variants: UpdateProductVariantDto[];
  deletedVariantIds: string[];
}

export class UpdateProductImageDto {
  image: string;
}

const convertToProductVariantDto = (
  variant: ProductVariant,
  inventories: Inventory[],
) => {
  const inventory = inventories.find((it) => it.variant?.id == variant.id);

  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    description: variant.description,
    image: variant.image,
    price: variant.price,
    sequence: variant.sequence,
    stock: inventory?.stock || 0,
    minStock: inventory?.minStock || 0,
    maxStock: inventory?.maxStock || 0,
  };
};

export class ViewProductDto {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  variants: ProductVariantDto[];
  defaultVariant?: ProductVariantDto;

  constructor(
    product: Product,
    variants: ProductVariant[],
    inventories: Inventory[],
  ) {
    this.id = product.id;
    this.name = product.name;
    this.brand = product.brand;
    this.category = product.category;
    this.description = product.description;
    this.image = product.image;
    this.variants = variants.map((variant) =>
      convertToProductVariantDto(variant, inventories),
    );
    if (product.defaultVariant) {
      this.defaultVariant = convertToProductVariantDto(
        product.defaultVariant,
        inventories,
      );
    } else if (this.variants.length >= 1) {
      this.defaultVariant = this.variants[0];
    }
  }
}

export class ProductQueryParams {
  page?: number;
  limit?: number;
  companyId?: string;
  category?: string;
  brand?: string;
  search?: string;
  searchField?: 'all' | 'name' | 'brand' | 'category' | 'size';
}
