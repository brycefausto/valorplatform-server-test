import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';

export type ItemDocument = HydratedDocument<Item> & WithTimestamps;

export class ItemVariant {
  name: string;
  image: string;
  price: number;
}

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class Item {
  id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: '' })
  brand: string;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: [ItemVariant], default: [] })
  variants: ItemVariant[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.plugin(mongoosePaginate);
ItemSchema.set('toJSON', {
  virtuals: true,
});

export const ItemSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Item.name,
    useFactory: (eventsService: EventsService) => {
      const schema = ItemSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('items', id);
      });

      return schema;
    },
  },
]);
