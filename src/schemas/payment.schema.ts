import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AppUser } from './appuser.schema';
import { Company } from './company.schema';
import { Order } from './order.schema';
import { NumberID } from './schema.plugins';

export type PaymentDocument = HydratedDocument<Payment> & WithTimestamps;

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
  NONE = '',
}

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class Payment {
  id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  })
  order?: Order;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company?: Company;

  @Prop()
  paymentMethod?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  updatedBy?: AppUser;

  @Prop()
  amount: number;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  image?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.plugin(mongoosePaginate);

export const PaymentSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Payment.name,
    useFactory: (eventsService: EventsService) => {
      const schema = PaymentSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('payments', id);
      });

      return schema;
    },
  },
]);
