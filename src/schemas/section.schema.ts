import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Department } from './department.schema';

export type SectionDocument = HydratedDocument<Section> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class Section {
  id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  professor: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    autopopulate: true,
  })
  department?: Department;
}

export const SectionSchema = SchemaFactory.createForClass(Section);

SectionSchema.plugin(mongoosePaginate);
SectionSchema.plugin(require('mongoose-autopopulate'));

export const SectionSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Section.name,
    useFactory: (eventsService: EventsService) => {
      const schema = SectionSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('sections', id);
      });

      return schema;
    },
  },
]);
