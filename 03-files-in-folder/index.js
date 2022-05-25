const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

(async function () {
  try {
    const files = await readdir(pathToFolder, {
      encoding: 'utf8',
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFolder, `${file.name}`);
        fs.stat(pathToFile, (err, stats) => {
          console.log(`${path.basename(pathToFile, path.extname(pathToFile))} - ${path.extname(pathToFile).slice(1)} - ${stats.size / 1024}kb`);
        });
      }
    }

  } catch (err) {
    console.error(err);
  }
})();