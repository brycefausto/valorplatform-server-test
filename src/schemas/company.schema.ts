import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AddressInfo } from './address-info.schema';

export type CompanyDocument = HydratedDocument<Company> & WithTimestamps;

@Schema({
  collection: 'companies',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class Company {
  id: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: AddressInfo;

  @Prop()
  description?: string;

  @Prop()
  logo?: string;

  @Prop()
  vendorId: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.plugin(mongoosePaginate);
CompanySchema.plugin(require('mongoose-autopopulate'));

export const CompanySchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Company.name,
    useFactory: (eventsService: EventsService) => {
      const schema = CompanySchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('companies', id);
      });

      return schema;
    },
  },
]);
