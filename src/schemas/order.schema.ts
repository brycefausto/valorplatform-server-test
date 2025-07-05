import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AddressInfo, AddressInfoSchema } from './address-info.schema';
import { AppUser } from './appuser.schema';
import { Company } from './company.schema';
import { Customer } from './customer.schema';
import { OrderItem } from './order-item.schema';
import { Payment } from './payment.schema';

export type OrderDocument = HydratedDocument<Order> & WithTimestamps;

export enum OrderStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded',
  NONE = '',
}

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class Order {
  id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    autopopulate: true,
  })
  customer?: Customer;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company?: Company;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  vendor?: AppUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  updatedBy?: AppUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    autopopulate: true,
  })
  payment?: Payment;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  subtotal: number;

  @Prop()
  tax: number;

  @Prop()
  shipping: number;

  @Prop()
  total: number;

  @Prop(AddressInfoSchema)
  shippingAddress: AddressInfo;

  @Prop(AddressInfoSchema)
  billingAddress: AddressInfo;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        autopopulate: true,
      },
    ],
  })
  items: OrderItem[];

  @Prop({ default: '' })
  trackingId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.plugin(mongoosePaginate);
OrderSchema.plugin(require('mongoose-autopopulate'));

export const OrderSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Order.name,
    useFactory: (eventsService: EventsService) => {
      const schema = OrderSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('orders', id);
      });

      return schema;
    },
  },
]);
