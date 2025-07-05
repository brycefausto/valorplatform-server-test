import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Company } from './company.schema';

export type BankAccountDocument = HydratedDocument<BankAccount> &
  WithTimestamps;

@Schema({
  collection: 'bank_accounts',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class BankAccount {
  id: string;

  @Prop()
  bank: string;

  @Prop()
  accountHolder: string;

  @Prop()
  accountNumber: string;

  @Prop()
  swiftCode: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company: Company;

  @Prop({ default: true })
  isActive: boolean;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);

BankAccountSchema.plugin(mongoosePaginate);
BankAccountSchema.plugin(require('mongoose-autopopulate'));

export const BankAccountSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: BankAccount.name,
    useFactory: (eventsService: EventsService) => {
      const schema = BankAccountSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('users', id);
      });

      return schema;
    },
  },
]);
