import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';

export type AppNotificationDocument = HydratedDocument<AppNotification> &
  WithTimestamps;

export class AppNotificationData {
  dataType?: string;
  dataId?: string;
}

@Schema({ timestamps: true, versionKey: false })
export class AppNotification {
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data?: AppNotificationData;
}

export const AppNotificationSchema =
  SchemaFactory.createForClass(AppNotification);

AppNotificationSchema.plugin(mongoosePaginate);
AppNotificationSchema.set('toJSON', {
  virtuals: true,
});

export const AppNotificationSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: AppNotification.name,
    useFactory: (eventsService: EventsService) => {
      const schema = AppNotificationSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('notifications', id);
      });

      return schema;
    },
  },
]);
