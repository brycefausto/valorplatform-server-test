import { ItemVariant } from '@/schemas/item.schema';

export class CreateItemDto {
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  variants: ItemVariant[];
  vendorId: string;
}

export class UpdateItemDto {
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  variants: ItemVariant[];
}

export class ItemQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  searchField?: 'all' | 'name' | 'brand' | 'category' | 'size';
}
