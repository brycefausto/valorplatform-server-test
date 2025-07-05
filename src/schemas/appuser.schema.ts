import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { encryptPassword } from '@/utils/password.utils';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Company } from './company.schema';

export type AppUserDocument = HydratedDocument<AppUser> & WithTimestamps;

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  DISTRIBUTOR = 'Distributor',
  RESELLER = 'Reseller',
  VIP = 'VIP',
  CUSTOMER = 'Customer',
  NONE = '',
}

@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class AppUser {
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: UserRole })
  role: UserRole;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company: Company;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  image?: string;

  @Prop()
  sessionToken?: string;

  @Prop([String])
  messagingTokens?: string[];
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);

AppUserSchema.plugin(mongoosePaginate);
AppUserSchema.plugin(require('mongoose-autopopulate'));

export const AppUserSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: AppUser.name,
    useFactory: (eventsService: EventsService) => {
      const schema = AppUserSchema;
      schema.pre('save', async function save(next) {
        if (!this.isModified('password')) return next();
        try {
          this.password = encryptPassword(this.password);
          return next();
        } catch (err) {
          return next(err);
        }
      });
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('users', id);
      });

      return schema;
    },
  },
]);
