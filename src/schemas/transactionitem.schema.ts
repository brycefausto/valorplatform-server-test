import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Item } from './item.schema';
import { Transaction } from './transaction.schema';

export const NonReturnableRemarks = ['Not Returned', 'Empty', 'Broken', 'Lost'];

export type TransactionItemDocument = HydratedDocument<TransactionItem> &
  WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class TransactionItem {
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' })
  transaction?: Transaction;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    autopopulate: true,
  })
  item: Item;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ default: 1 })
  returnQuantity: number;

  @Prop()
  size?: string;

  @Prop()
  fillStatus?: string;

  @Prop()
  remarks?: string;

  lostQuantity: number;
}

export const TransactionItemSchema =
  SchemaFactory.createForClass(TransactionItem);

TransactionItemSchema.plugin(mongoosePaginate);
TransactionItemSchema.plugin(require('mongoose-autopopulate'));
TransactionItemSchema.set('toJSON', {
  virtuals: true,
});

export const TransactionItemSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: TransactionItem.name,
    useFactory: (eventsService: EventsService) => {
      const schema = TransactionItemSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('transactions', id);
      });

      return schema;
    },
  },
]);
