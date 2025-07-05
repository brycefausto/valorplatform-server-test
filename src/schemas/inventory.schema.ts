import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AppUser } from './appuser.schema';
import { Company } from './company.schema';
import { ProductVariant } from './product-variant.schema';
import { WarehouseLocation } from './warehouse-location.schema';

export type InventoryDocument = HydratedDocument<Inventory> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class Inventory {
  id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    autopopulate: true,
  })
  variant?: ProductVariant;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  vendor?: AppUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company?: Company;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    autopopulate: true,
  })
  location?: WarehouseLocation;

  @Prop()
  stock: number;

  @Prop({ default: 0 })
  minStock: number;

  @Prop({ default: 100 })
  maxStock: number;

  @Prop()
  price: number;
  
  @Prop()
  isCompanyInventory?: boolean
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.plugin(mongoosePaginate);
InventorySchema.plugin(require('mongoose-autopopulate'));

export const InventorySchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Inventory.name,
    useFactory: (eventsService: EventsService) => {
      const schema = InventorySchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('inventory', id);
      });

      return schema;
    },
  },
]);
