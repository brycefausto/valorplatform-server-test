import { AppUser } from '@/schemas/appuser.schema';
import { Inventory } from '@/schemas/inventory.schema';
import { ProductVariant } from '@/schemas/product-variant.schema';
import { Product } from '@/schemas/product.schema';

export class CreateInventoryDto {
  variantId: string;
  vendorId: string;
  stock: number = 0;
  minStock: number = 0;
  maxStock: number = 100;
  price: number;
}

export class UpdateInventoryDto {
  variantId: string;
  vendorId: string;
  stock: number;
  minStock: number;
  maxStock: number;
  price: number;
  locationId: string;
}

export class InventoryQueryParams {
  page?: number;
  limit?: number;
  companyId?: string;
  category?: string;
  search?: string;
  searchField?: 'all' | 'name' | 'brand' | 'category' | 'size';
}

export class InventoryDto {
  id: string;
  variant?: ProductVariant;
  product?: Product;
  vendor?: AppUser;
  image: string;
  stock: number = 0;
  minStock: number = 0;
  maxStock: number = 0;
  price: number;
  constructor(inventory: Inventory, product?: Product) {
    this.id = inventory.id;
    this.variant = inventory.variant;
    this.product = product;
    this.vendor = inventory.vendor;
    this.image = inventory.variant?.image || '';
    this.stock = inventory.stock;
    this.minStock = inventory.minStock;
    this.maxStock = inventory.maxStock;
    this.price = inventory.price;
  }
}
