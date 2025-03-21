import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AppUser } from './appuser.schema';
import { Section } from './section.schema';
import { Subject } from './subject.schema';
import { TransactionItem } from './transactionitem.schema';
import { Department } from './department.schema';

export enum TransactionStatus {
  RESERVED = 'reserved',
  APPROVED = 'approved',
  RETURNED = 'returned',
  NOT_RETURNED = 'not_returned',
}

export type TransactionDocument = HydratedDocument<Transaction> &
  WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  user: AppUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    autopopulate: true,
  })
  department?: Department;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    autopopulate: true,
  })
  section: Section;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    autopopulate: true,
  })
  subject: Subject;

  @Prop()
  groupNo: string;

  @Prop({ type: [String] })
  members: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TransactionItem' }],
    autopopulate: true,
  })
  items: TransactionItem[];

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.RESERVED,
  })
  status: TransactionStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  approveUser?: AppUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  returnUser?: AppUser;

  @Prop()
  createdAt: Date;

  @Prop()
  borrowedAt?: Date;

  @Prop()
  returnedAt?: Date;

  @Prop({ type: [String], default: [] })
  itemRemarks: string[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.plugin(require('mongoose-autopopulate'));
TransactionSchema.plugin(mongoosePaginate);
TransactionSchema.set('toJSON', {
  virtuals: true,
});
TransactionSchema.virtual('sectionDepartment').get(function () {
  return this.section?.name || this.department?.name;
});

export const TransactionSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Transaction.name,
    useFactory: (eventsService: EventsService) => {
      const schema = TransactionSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('transactions', id);
      });

      return schema;
    },
  },
]);
