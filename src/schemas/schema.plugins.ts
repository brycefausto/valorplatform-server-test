import { isNull } from 'lodash';
import mongoose from 'mongoose';

const IDSchema = new mongoose.default.Schema({
  field: String,
  modelName: String,
  count: BigInt,
}, { versionKey: false });
IDSchema.index({ field: 1, modelName: 1 }, { unique: true });

const startingNumberId = 1000001;
const trackerModelName = 'identity_tracker';
const trackerCollectionName = 'identity_trackers';


export interface NumberIDOpts {
  field: string,
}

export function NumberID(schema: mongoose.Schema, options?: NumberIDOpts) {
  const opt: NumberIDOpts = {
    field: '_id',
    ...options
  }
  schema.pre('save', async function save() {
    if (!this.isNew) {
      return;
    }

    const modelName = (this.constructor as any).modelName as string
    const model = this.db.model(trackerModelName, IDSchema, trackerCollectionName);
    const counter = await model
      .findOne({
        modelName: modelName,
        field: opt.field,
      })
      .lean()
      .exec();
    if (!counter) {
      await model.create({
        modelName: modelName,
        field: opt.field,
        count: startingNumberId - 1,
      });
    }

    const leandoc = await model
      .findOneAndUpdate({
        field: opt.field,
        modelName: modelName,
      }, {
        $inc: { count: 1 },
      }, {
        new: true,
        fields: { count: 1, _id: 0 },
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .lean()
      .exec();
    if (isNull(leandoc)) {
      throw new Error(`"findOneAndUpdate" incrementing count failed for "${modelName}" on field "${opt.field}"`);
    }
    this[opt.field] = leandoc.count?.toString() || "";
    return;
  })
}
