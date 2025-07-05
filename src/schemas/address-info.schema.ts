import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WithTimestamps } from '.';

export type AddressInfoDocument = HydratedDocument<AddressInfo> &
  WithTimestamps;

@Schema({
  collection: 'address_infos',
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class AddressInfo {
  @Prop()
  address: string;

  @Prop()
  address2?: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipCode?: string;

  @Prop()
  country: string;
}

export const AddressInfoSchema = SchemaFactory.createForClass(AddressInfo);
