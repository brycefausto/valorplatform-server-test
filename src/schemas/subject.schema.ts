import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';

export type SubjectDocument = HydratedDocument<Subject> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class Subject {
  id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  professor: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

SubjectSchema.plugin(mongoosePaginate);

export const SubjectSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Subject.name,
    useFactory: (eventsService: EventsService) => {
      const schema = SubjectSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('subjects', id);
      });

      return schema;
    },
  },
]);
