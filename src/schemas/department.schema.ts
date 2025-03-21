import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';

export type DepartmentDocument = HydratedDocument<Department> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false })
export class Department {
  id: string;

  @Prop({ required: true, unique: true })
  name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

DepartmentSchema.plugin(mongoosePaginate);

export const DepartmentSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Department.name,
    useFactory: (eventsService: EventsService) => {
      const schema = DepartmentSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('departments', id);
      });

      return schema;
    },
  },
]);
