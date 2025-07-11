import { CompaniesService } from '@/companies/companies.service';
import { InventoryService } from '@/inventory/inventory.service';
import { OrdersService } from '@/orders/orders.service';
import { ProductsService } from '@/products/products.service';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private productsService: ProductsService,
    private inventoryService: InventoryService,
    private orderService: OrdersService,
  ) {}

  async countReportSuperAdmin() {
    const userCount = await this.usersService.count();
    const companyCount = await this.companiesService.count();

    return {
      userCount,
      companyCount,
    };
  }

  async countReportAdmin(companyId: string, vendorId: string) {
    const userCount = await this.usersService.count(companyId);
    const productCount = await this.productsService.count(companyId);
    const inventoryCount = await this.inventoryService.count(vendorId);
    const orderCount = await this.orderService.count(companyId);
    const lowStockCount = await this.inventoryService.countLowStock(vendorId);
    const pendingOrdersCount = await this.orderService.countPending(vendorId);

    return {
      userCount,
      productCount,
      inventoryCount,
      orderCount,
      lowStockCount,
      pendingOrdersCount,
    };
  }

  async countReportDistributor(vendorId: string) {
    const inventoryCount = await this.inventoryService.count(vendorId);
    const orderCount = await this.orderService.count(vendorId);
    const lowStockCount = await this.inventoryService.countLowStock(vendorId);
    const pendingOrdersCount = await this.orderService.countPending(vendorId);

    return {
      inventoryCount,
      orderCount,
      lowStockCount,
      pendingOrdersCount,
    };
  }
}
