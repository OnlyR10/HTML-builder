const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');

(async function () {
  try {
    const files = await readdir(pathToStyles, {
      encoding: 'utf8',
      withFileTypes: true,
    });
    const output = fs.createWriteStream(pathToBundle);
    for (const file of files) {
      const pathToFile = path.join(pathToStyles, `${file.name}`);

      if (file.isFile() && path.extname(pathToFile).slice(1) === 'css') {
        const input = fs.createReadStream(pathToFile, 'utf-8');
        input.on('error', error => console.log('Error', error.message));
        input.pipe(output);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();