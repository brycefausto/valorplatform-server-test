import { Schema } from 'mongoose';

const schemaHooks: SchemaHook[] = [
  'deleteOne',
  'deleteMany',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'insertMany',
  'replaceOne',
  'save',
  'updateOne',
  'updateMany',
];

type SchemaHook = RegExp | any;

export const addSchemaPostHooks = (
  schema: Schema,
  func: (id?: string) => void,
) => {
  for (const schemaHook of schemaHooks) {
    switch (schemaHook) {
      case 'deleteOne':
      case 'findOneAndDelete':
      case 'findOneAndReplace':
      case 'findOneAndUpdate':
      case 'replaceOne':
      case 'save':
      case 'updateOne':
        schema.post(schemaHook, (doc) => func(doc?.id));
        break;
      default:
        schema.post(schemaHook, func);
    }
  }
};
