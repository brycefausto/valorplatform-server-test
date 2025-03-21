import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Item } from './item.schema';
import { AppUser } from './appuser.schema';

export type InventoryDocument = HydratedDocument<InventoryItem> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class InventoryItem {
  id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    autopopulate: true,
  })
  item?: Item;

  @Prop()
  variantName: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  vendor?: AppUser;

  @Prop()
  stock: number;

  @Prop()
  price: number;
}

export const InventorySchema = SchemaFactory.createForClass(InventoryItem);

InventorySchema.plugin(mongoosePaginate);
InventorySchema.plugin(require('mongoose-autopopulate'));
InventorySchema.set('toJSON', {
  virtuals: true,
});

export const InventorySchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: InventoryItem.name,
    useFactory: (eventsService: EventsService) => {
      const schema = InventorySchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('inventory', id);
      });

      return schema;
    },
  },
]);
