import { CreateInventoryItemDto } from '@/inventory/inventory.dto';
import { CreateItemDto } from '@/items/items.dto';
import { ItemsService } from '@/items/items.service';
import { AppUserDocument, UserRole } from '@/schemas/appuser.schema';
import { InventoryDocument } from '@/schemas/inventory.schema';
import { ItemDocument } from '@/schemas/item.schema';
import { Model } from 'mongoose';

export const createItemData = async (
  itemModel: Model<ItemDocument>, 
  appUserModel: Model<AppUserDocument>,
  inventoryModel: Model<InventoryDocument>,
) => {
  const count = await itemModel.estimatedDocumentCount();

  if (count == 0) {
    const user = await appUserModel.findOne({ role: UserRole.ADMIN })
    const items: CreateItemDto[] = [
      {
        name: "Perfume 1",
        brand: "Sample Brand 1",
        category: "Women's Perfume",
        description: "Sample perfume description 1",
        vendorId: user?.id,
        image: "perfume_1_KWJzcZJby.jpg",
        variants: [
          {
            name: "Variant 1",
            image: "perfume_1_KWJzcZJby.jpg",
            price: 150
          },
        ]
      },
      {
        name: "Perfume 2",
        brand: "Sample Brand 2",
        category: "Women's Perfume",
        description: "Sample perfume description 2",
        vendorId: user?.id,
        image: "perfume_2_xVYptOs5B.jpg",
        variants: [
          {
            name: "Variant 1",
            image: "perfume_2_xVYptOs5B.jpg",
            price: 120
          },
        ]
      },
      {
        name: "Perfume 3",
        brand: "Sample Brand 3",
        category: "Women's Perfume",
        description: "Sample perfume description 3",
        vendorId: user?.id,
        image: "perfume_3_uZidgSniy.jpg",
        variants: [
          {
            name: "Variant 1",
            image: "perfume_3_uZidgSniy.jpg",
            price: 110
          },
        ]
      }
    ];

    const newItems = await itemModel.create(items)

    const inventoryItems: any = []
    for (const item of newItems) {
      for (const variant of item.variants) {
        inventoryItems.push({
          item,
          vendor: user?.id,
          variantName: variant.name,
          stock: 10,
          price: variant.price
        })
      }
    }
    await inventoryModel.create(inventoryItems)
  }
};
