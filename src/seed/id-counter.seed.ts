import { IDCounter, IDCounterDocument } from '@/schemas/id-counter.schema';
import { Model } from 'mongoose';

export const createIDCounterData = async (
  idCounterModel: Model<IDCounterDocument>,
) => {
  const count = await idCounterModel.estimatedDocumentCount();

  if (count == 0) {
    const idCounters: IDCounter[] = [
      {
        _id: 'users',
        seq: 100000000,
      },
      {
        _id: 'items',
        seq: 100000000,
      },
      {
        _id: 'transactions',
        seq: 100000000,
      },
    ];

    await idCounterModel.create(idCounters);
  }
};
