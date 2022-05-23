const fs = require('fs');
const path = require('path');
const { mkdir, copyFile, readdir, rm, stat } = require('fs/promises');

const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToNewAssets = path.join(__dirname, 'project-dist', 'assets');

(async function () {
  await createFolder();
  copyFilesToFolder(pathToAssets, pathToNewAssets);
  createBundle();
})();

async function createFolder() {
  try {
    await stat(path.join(__dirname, 'project-dist'));
    await rm(path.join(__dirname, 'project-dist'), { recursive: true });
  } catch (err) {
    // The folder is not created
  }

  await mkdir(pathToNewAssets, { recursive: true });
}

async function createBundle() {
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
}

async function copyFilesToFolder(pathToAssets, pathToNewAssets) {
  try {
    const files = await readdir(pathToAssets, {
      encoding: 'utf8',
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.join(pathToAssets, file.name), path.join(pathToNewAssets, file.name));
      } else {
        await mkdir(path.join(pathToNewAssets, file.name), { recursive: true });
        await copyFilesToFolder(path.join(pathToAssets, file.name), path.join(pathToNewAssets, file.name));
      }
    }

  } catch (err) {
    console.error(err);
  }
}