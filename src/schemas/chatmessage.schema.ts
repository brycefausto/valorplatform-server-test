import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { AppUser } from './appuser.schema';
import { Chat } from './chat.schema';

export type ChatMessageDocument = HydratedDocument<ChatMessage> &
  WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class ChatMessage {
  id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    autopopulate: false,
  })
  chat: Chat;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser',
    autopopulate: true,
  })
  user: AppUser;

  @Prop()
  message: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

ChatMessageSchema.plugin(mongoosePaginate);
ChatMessageSchema.set('toJSON', {
  virtuals: true,
});

export const ChatMessageSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: ChatMessage.name,
    useFactory: (eventsService: EventsService) => {
      const schema = ChatMessageSchema;

      return schema;
    },
  },
]);
