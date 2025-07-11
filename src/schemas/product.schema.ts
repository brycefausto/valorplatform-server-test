import { EventsModule } from '@/events/events.module';
import { EventsService } from '@/events/events.service';
import { addSchemaPostHooks } from '@/utils/schema.utils';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { WithTimestamps } from '.';
import { Company } from './company.schema';
import { ProductVariant } from './product-variant.schema';

export type ProductDocument = HydratedDocument<Product> & WithTimestamps;

@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class Product {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  brand: string;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop([String])
  images?: string[];

  @Prop()
  price: number;

  @Prop({ default: 0 })
  originalPrice: number;

  @Prop()
  isSale?: boolean

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    autopopulate: true,
  })
  company?: Company;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    autopopulate: true,
  })
  defaultVariant?: ProductVariant;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        autopopulate: true,
      },
    ],
  })
  variants: ProductVariant[];

  @Prop({ default: 5 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(require('mongoose-autopopulate'));

export const ProductSchemaModule = MongooseModule.forFeatureAsync([
  {
    imports: [EventsModule],
    inject: [EventsService],
    name: Product.name,
    useFactory: (eventsService: EventsService) => {
      const schema = ProductSchema;
      addSchemaPostHooks(schema, function (id) {
        eventsService.emitData('products', id);
      });

      return schema;
    },
  },
]);
