import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';

export type ProductVariantDocument = HydratedDocument<ProductVariant> &
  WithTimestamps;

@Schema({
  collection: 'product_variants',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class ProductVariant {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sku: string;

  @Prop()
  productId: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  sequence: number;

  stock?: number;

  minStock?: number;

  maxStock?: number;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

ProductVariantSchema.plugin(mongoosePaginate);

export const ProductVariantSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: ProductVariant.name,
    useFactory: (eventsService: EventsService) => {
      const schema = ProductVariantSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('product_variants', id);
      });

      return schema;
    },
  },
]);
