import * as fs from 'fs';
import * as carbone from 'carbone';

export async function generateReport(
  templatePath: string,
  filePath: string,
  data: any,
) {
  return new Promise((resolve, reject) => {
    carbone.render(templatePath, data, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }

      fs.writeFileSync(filePath, Buffer.from(result));
      resolve(null);
    });
  });
}

export async function renderReport(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}
