import { AppUser } from '@/schemas/appuser.schema';
import { InventoryItem } from '@/schemas/inventory.schema';
import { Item } from '@/schemas/item.schema';

export class CreateInventoryItemDto {
  itemId: string;
  vendorId: string;
  variantName: string;
  stock: number = 0;
  price: number;
}

export class UpdateInventoryItemDto extends CreateInventoryItemDto {}

export class InventoryQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  searchField?: 'all' | 'name' | 'brand' | 'category' | 'size';
}

export class InventoryItemDto {
  id: string;
  item?: Item;
  vendor?: AppUser;
  variantName: string;
  image: string;
  stock: number = 0;
  price: number;
  constructor(inventory: InventoryItem) {
    this.id = inventory.id;
    this.item = inventory.item;
    this.vendor = inventory.vendor;
    this.variantName = inventory.variantName;
    const itemVariants = inventory.item?.variants || [];
    const itemVariant = itemVariants.find(
      (it) => it.name == inventory.variantName,
    );
    this.image = itemVariant?.image || '';
    this.item = inventory.item;
    this.stock = inventory.stock;
    this.price = inventory.price;
  }
}
