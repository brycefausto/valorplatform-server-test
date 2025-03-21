import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CallbackWithoutResultAndOptionalError,
  Document,
  HydratedDocument,
  Model,
  model,
} from 'mongoose';
import { WithTimestamps } from '.';

export type IDCounterDocument = HydratedDocument<IDCounter> & WithTimestamps;

@Schema({ collection: 'id_counters', timestamps: false, versionKey: false })
export class IDCounter {
  @Prop()
  _id: string;

  @Prop()
  seq: number;
}

export const IDCounterSchema = SchemaFactory.createForClass(IDCounter);

IDCounterSchema.set('toJSON', {
  virtuals: true,
});

export const getAutoIncrement = async (
  idCounterModel: Model<IDCounterDocument>,
  counterName: string,
) => {
  const idCounter = await idCounterModel.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return idCounter.seq.toString();
};

export const IDCounterSchemaModule = MongooseModule.forFeature([
  {
    name: IDCounter.name,
    schema: IDCounterSchema,
  },
]);
