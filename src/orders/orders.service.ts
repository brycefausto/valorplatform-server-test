import { BASE_COMPANIES_IMAGE_URL } from '@/config/env';
import { AppUser, AppUserDocument } from '@/schemas/appuser.schema';
import {
  BankAccount,
  BankAccountDocument,
} from '@/schemas/bank-account.schema';
import { Company, CompanyDocument } from '@/schemas/company.schema';
import { Customer, CustomerDocument } from '@/schemas/customer.schema';
import {
  OrderItem,
  OrderItemDocument,
  OrderItemStatus,
} from '@/schemas/order-item.schema';
import { Order, OrderDocument } from '@/schemas/order.schema';
import {
  Payment,
  PaymentDocument,
  PaymentStatus,
} from '@/schemas/payment.schema';
import {
  ProductVariant,
  ProductVariantDocument,
} from '@/schemas/product-variant.schema';
import { toDateString } from '@/utils/date.utils';
import { receivedOrderTemplate, sendMail } from '@/utils/email.utils';
import { computeTax } from '@/utils/pricing.utils';
import { formatPrice } from '@/utils/string.utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEqual, merge, omit } from 'lodash';
import { DateTime } from 'luxon';
import { PaginateModel } from 'mongoose';
import {
  CreateOrderDto,
  OrderQueryParams,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: PaginateModel<OrderDocument>,
    @InjectModel(OrderItem.name)
    private orderItemModel: PaginateModel<OrderItemDocument>,
    @InjectModel(Payment.name)
    private paymentModel: PaginateModel<PaymentDocument>,
    @InjectModel(ProductVariant.name)
    private productVariantModel: PaginateModel<ProductVariantDocument>,
    @InjectModel(AppUser.name)
    private appUserModel: PaginateModel<AppUserDocument>,
    @InjectModel(Company.name)
    private companyModel: PaginateModel<CompanyDocument>,
    @InjectModel(Customer.name)
    private customerModel: PaginateModel<CustomerDocument>,
    @InjectModel(BankAccount.name)
    private bankAccountModel: PaginateModel<BankAccountDocument>,
  ) {}

  async create(createDto: CreateOrderDto) {
    const company = await this.companyModel.findById(createDto.companyId);

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    const vendor = await this.appUserModel.findById(
      createDto.vendorId || company.vendorId,
    );

    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }

    if (!createDto.customerId && !createDto.customerDto) {
      throw new BadRequestException('Missing customer info.');
    }

    let customer: Customer | null | undefined;

    if (createDto.customerId) {
      customer = await this.customerModel.findById(createDto.customerId);

      if (!customer) {
        throw new NotFoundException('Customer not found.');
      }
    } else if (createDto.customerDto) {
      customer = await this.customerModel.create(merge(createDto.customerDto));
    }

    const order = await this.orderModel.create(
      merge(
        omit(
          createDto,
          'customerId',
          'customerDto',
          'companyId',
          'items',
          'payment',
        ),
        { customer, company, tax: computeTax(createDto.subtotal) },
      ),
    );

    const orderItems = await Promise.all(
      createDto.items.map(async (orderItemDto) => {
        const productVariant = await this.productVariantModel.findById(
          orderItemDto.productVariantId,
        );
        return await this.orderItemModel.create(
          merge(omit(orderItemDto, 'productVariantId'), {
            total: orderItemDto.price * orderItemDto.quantity,
            orderId: order.id,
            productVariant,
          }),
        );
      }),
    );

    order.items = orderItems;

    const payment = await this.paymentModel.create(
      merge(
        { order, company, status: PaymentStatus.PENDING },
        createDto.payment,
      ),
    );

    order.payment = payment;

    await order.save();

    let bankAccounts: BankAccount[] = [];

    if (createDto.bankIds) {
      bankAccounts = await this.bankAccountModel.find({
        _id: { $in: createDto.bankIds },
        isActive: true,
      });
    }

    if (customer) {
      sendMail(customer.email, 'Order Received', receivedOrderTemplate, {
        company: company.name,
        companyEmail: company.email,
        logo: BASE_COMPANIES_IMAGE_URL + company.logo,
        customer: customer.fullName,
        orderId: order.id,
        orderDate: toDateString(order.createdAt),
        estimatedDeliveryDate: DateTime.fromJSDate(order.createdAt).plus({
          days: 3,
        }),
        subtotal: formatPrice(order.subtotal),
        shipping: formatPrice(order.shipping),
        total: formatPrice(order.total),
        items: orderItems.map((it) => ({
          name: it.productVariant?.name,
          quantity: it.quantity,
          price: formatPrice(it.price),
          total: formatPrice(it.total),
        })),
        shippingAddress: order.shippingAddress,
        billingAddress: !isEqual(order.shippingAddress, order.billingAddress)
          ? order.billingAddress
          : null,
        bankAccounts,
      });
    }

    return order;
  }

  async update(id: string, updateDto: UpdateOrderDto) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, omit(updateDto, 'items'), { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const orderItems: OrderItem[] = [];

    await Promise.all(
      updateDto.items.map(async (orderItemDto) => {
        const productVariant = await this.productVariantModel.findById(
          orderItemDto.id,
        );

        if (!productVariant) {
          throw new NotFoundException('Product Variant not found.');
        }

        const orderItem = orderItemDto.id
          ? await this.orderItemModel.findByIdAndUpdate(
              orderItemDto.id,
              merge(omit(orderItemDto, 'productVariantId'), { productVariant }),
              { new: true },
            )
          : await this.orderItemModel.create(
              merge(omit(orderItemDto, 'productVariantId'), { productVariant }),
            );

        if (orderItem) {
          orderItems.push(orderItem);
        }
      }),
    );

    order.items = orderItems;

    return await order.save();
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateDto.status;
    order.trackingId = updateDto.trackingId;

    const orderItems: OrderItem[] = [];
    const orderItemStatus = updateDto.status as unknown as OrderItemStatus;

    for (const item of order.items) {
      const orderItem = await this.orderItemModel.findByIdAndUpdate(
        item.id,
        { status: orderItemStatus },
        { new: true },
      );

      if (orderItem) {
        orderItems.push(orderItem);
      }
    }

    order.items = orderItems;

    if (order.payment) {
      await this.paymentModel.findByIdAndUpdate(order.payment, {
        status: updateDto.paymentStatus,
      });
    }

    return await order.save();
  }

  async findAll(queryParams: OrderQueryParams) {
    const { page, limit = 10, search } = queryParams;
    let query: any = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = { name: searchRegex };
    }

    const data = await this.orderModel.paginate(query, {
      page,
      limit,
      sort: { createdAt: 'desc' },
      populate: {
        path: 'company customer items payment',
      },
    });

    for (const order of data.docs) {
      const items: OrderItem[] = [];
      for (const orderItem of order.items) {
        const item = await this.orderItemModel.findById(orderItem.id);
        if (item) {
          items.push(item);
        }
      }

      order.items = items;
    }

    return data;
  }

  async search(queryString: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    return this.orderModel.find({ name: queryRegex }).limit(10).exec();
  }

  async findOne(id: string) {
    return this.orderModel.findById(id).exec();
  }

  async count(companyId: string) {
    return this.orderModel.countDocuments({ company: companyId });
  }

  async findByIdNumber(idNumber: string) {
    return this.orderModel.findOne({ idNumber }).exec();
  }

  async delete(id: string) {
    await this.orderItemModel.findOneAndDelete({ order: id }).exec();
    await this.paymentModel.findOneAndDelete({ order: id }).exec();
    return await this.orderModel.findByIdAndDelete(id).exec();
  }
}
