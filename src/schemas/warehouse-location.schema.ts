import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AddressInfo } from './address-info.schema';
import { Company } from './company.schema';

export type WarehouseLocationDocument = HydratedDocument<WarehouseLocation> &
  WithTimestamps;

@Schema({
  collection: 'warehouse_locations',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class WarehouseLocation {
  id: string;

  @Prop()
  name: string;

  @Prop()
  address: AddressInfo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company?: Company;
}

export const WarehouseLocationSchema = SchemaFactory.createForClass(WarehouseLocation);

WarehouseLocationSchema.plugin(mongoosePaginate);
WarehouseLocationSchema.plugin(require('mongoose-autopopulate'));

export const WarehouseLocationSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: WarehouseLocation.name,
    useFactory: (eventsService: EventsService) => {
      const schema = WarehouseLocationSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('locations', id);
      });

      return schema;
    },
  },
]);
