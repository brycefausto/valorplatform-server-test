import * as path from 'path';
import * as fs from 'fs';
import handlebars from 'handlebars';

export const compileTemplate = (template: string, payload: any) => {
  const source = fs.readFileSync(
    path.join('src', 'utils', 'htmlTemplates', template),
    'utf8',
  );
  return handlebars.compile(source)(payload);
};
