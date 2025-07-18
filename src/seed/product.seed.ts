import { CreateProductDto } from '@/products/product.dto';
import { ProductsService } from '@/products/products.service';
import { AppUser } from '@/schemas/appuser.schema';
import { Company } from '@/schemas/company.schema';

export const createProductsData = async (
  productsService: ProductsService,
  user: AppUser,
  company: Company,
) => {
  const count = await productsService.count(user.company?.id || '');

  if (user && count == 0) {
    const createProductDtos: CreateProductDto[] = [
      {
        name: 'Perfume 1',
        brand: 'Brand 1',
        description: 'Test description 1',
        category: 'Perfume Category 1',
        image: 'perfume_1_KWJzcZJby.jpg',
        companyId: company.id,
        variants: [
          {
            name: 'Perfume 1 - 24ml',
            sku: 'PF124',
            description: '',
            image: 'perfume_1_KWJzcZJby.jpg',
            price: 250,
            stock: 100,
            minStock: 5,
            maxStock: 100,
          },
          {
            name: 'Perfume 1 - 50ml',
            sku: 'PF150',
            description: '',
            image: 'perfume_1_KWJzcZJby.jpg',
            price: 450,
            stock: 100,
            minStock: 5,
            maxStock: 100,
          },
        ],
      },
      {
        name: 'Perfume 2',
        brand: 'Brand 2',
        description: 'Test description 2',
        category: 'Perfume Category 2',
        image: 'perfume_2_xVYptOs5B.jpg',
        companyId: company.id,
        variants: [
          {
            name: 'Perfume 2 - 24ml',
            sku: 'PF224',
            description: '',
            image: 'perfume_2_xVYptOs5B.jpg',
            price: 250,
            stock: 100,
            minStock: 5,
            maxStock: 100,
          },
          {
            name: 'Perfume 2 - 50ml',
            sku: 'PF250',
            description: '',
            image: 'perfume_2_xVYptOs5B.jpg',
            price: 450,
            stock: 100,
            minStock: 5,
            maxStock: 100,
          },
        ],
      },
      {
        name: 'Perfume 3',
        brand: 'Brand 3',
        description: 'Test description 3',
        category: 'Perfume Category 3',
        image: 'perfume_3_uZidgSniy.jpg',
        companyId: company.id,
        variants: [
          {
            name: 'Perfume 3 - 24ml',
            sku: 'PF324',
            description: '',
            image: 'perfume_3_uZidgSniy.jpg',
            price: 250,
            stock: 100,
            minStock: 5,
            maxStock: 100,
          },
          {
            name: 'Perfume 3 - 50ml',
            sku: 'PF350',
            description: '',
            image: 'perfume_3_uZidgSniy.jpg',
            price: 450,
            stock: 100,
            minStock: 5,
            maxStock: 100,
          },
        ],
      },
    ];

    for (const createDto of createProductDtos) {
      await productsService.create(createDto, user);
    }
  }
};
