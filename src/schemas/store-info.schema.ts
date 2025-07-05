import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AddressInfo } from './address-info.schema';
import { Company } from './company.schema';

export type StoreInfoDocument = HydratedDocument<StoreInfo> & WithTimestamps;

@Schema({
  collection: 'store_infos',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class StoreInfo {
  id: string;

  @Prop()
  name: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: AddressInfo;

  @Prop()
  description?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company?: Company;

  @Prop()
  logo?: string;
}

export const StoreInfoSchema = SchemaFactory.createForClass(StoreInfo);
StoreInfoSchema.plugin(mongoosePaginate);
StoreInfoSchema.plugin(require('mongoose-autopopulate'));

export const CompanySchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: StoreInfo.name,
    useFactory: (eventsService: EventsService) => {
      const schema = StoreInfoSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('store_infos', id);
      });

      return schema;
    },
  },
]);
