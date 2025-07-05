import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Order, OrderStatus } from './order.schema';
import { ProductVariant } from './product-variant.schema';

export type OrderItemDocument = HydratedDocument<OrderItem> & WithTimestamps;

export enum OrderItemStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  NONE = '',
}

@Schema({
  collection: 'order_items',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class OrderItem {
  id: string;

  orderId?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    autopopulate: true,
  })
  productVariant?: ProductVariant;

  @Prop({ type: String, enum: OrderItemStatus, default: OrderStatus.PENDING })
  status: OrderItemStatus;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  total: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

OrderItemSchema.plugin(mongoosePaginate);
OrderItemSchema.plugin(require('mongoose-autopopulate'));

export const OrderItemSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: OrderItem.name,
    useFactory: (eventsService: EventsService) => {
      const schema = OrderItemSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('orderItems', id);
      });

      return schema;
    },
  },
]);
