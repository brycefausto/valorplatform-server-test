import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AppUser } from './appuser.schema';

export type ChatDocument = HydratedDocument<Chat> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class Chat {
  id: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AppUser' }],
    autopopulate: true,
  })
  users: AppUser[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.plugin(mongoosePaginate);
ChatSchema.set('toJSON', {
  virtuals: true,
});

export const ChatSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Chat.name,
    useFactory: (eventsService: EventsService) => {
      const schema = ChatSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('chats', id);
      });

      return schema;
    },
  },
]);
