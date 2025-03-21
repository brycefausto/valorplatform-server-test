import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { encryptPassword } from '@/utils/password.utils';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import {
  getModelToken,
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import {
  getAutoIncrement,
  IDCounter,
  IDCounterDocument,
  IDCounterSchemaModule,
} from './id-counter.schema';

export type AppUserDocument = HydratedDocument<AppUser> & WithTimestamps;

export enum UserRole {
  ADMIN = 'Admin',
  DISTRIBUTOR = 'Distributor',
  RESELLER = 'Reseller',
  VIP = 'VIP',
  CUSTOMER = 'Customer',
  NONE = '',
}

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class AppUser {
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  idNumber?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole })
  role: UserRole;

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
AppUserSchema.set('toJSON', {
  virtuals: true,
});

export const AppUserSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule, IDCounterSchemaModule],
    inject: [EventsService, getModelToken(IDCounter.name)],
    name: AppUser.name,
    useFactory: (
      eventsService: EventsService,
      idCounterModel: Model<IDCounterDocument>,
    ) => {
      const schema = AppUserSchema;
      schema.pre('save', async function save(next) {
        if (!this.isModified('password')) return next();
        try {
          this.password = encryptPassword(this.password);
          this.idNumber = await getAutoIncrement(idCounterModel, 'users');
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
