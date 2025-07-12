import { AddressInfo } from '@/schemas/address-info.schema';
import { OrderStatus } from '@/schemas/order.schema';
import { PaymentStatus } from '@/schemas/payment.schema';

export class OrderItemDto {
  id?: string;
  productVariantId: string;
  status: OrderStatus;
  price: number;
  quantity: number;
  shippingAddress: string;
}

export class CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  address: AddressInfo;
  phone?: string;
}

export class CreatePaymentDto {
  paymentMethod?: string;
  amount: number;
  status: PaymentStatus;
}

export class BankInfoDto {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

export class CreateOrderDto {
  companyId: string;
  vendorId: string;
  customerId?: string;
  customerDto?: CreateCustomerDto;
  payment: CreatePaymentDto;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: AddressInfo;
  billingAddress?: AddressInfo;
  items: OrderItemDto[];
  bankIds?: string[];
}

export class UpdateOrderDto {
  status: OrderStatus;
  total: number;
  shippingAddress: AddressInfo;
  items: OrderItemDto[];
  deletedItemIds: string[];
  trackingId: string;
}

export class UpdateOrderStatusDto {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingId: string;
}

export class OrderQueryParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export class OrderCountReport {
  pendingCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  refundedCount: number;
}
