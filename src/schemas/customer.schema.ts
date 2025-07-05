import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AddressInfo, AddressInfoSchema } from './address-info.schema';
import { AppUser } from './appuser.schema';

export type CustomerDocument = HydratedDocument<Customer> & WithTimestamps;

@Schema({
  collection: 'customers',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class Customer {
  id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop(AddressInfoSchema)
  address: AddressInfo;

  @Prop()
  phone?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  user?: AppUser;

  @Virtual({
    get: function (this: Customer) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.plugin(mongoosePaginate);
CustomerSchema.plugin(require('mongoose-autopopulate'));

export const CustomerSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Customer.name,
    useFactory: (eventsService: EventsService) => {
      const schema = CustomerSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('customers', id);
      });

      return schema;
    },
  },
]);
