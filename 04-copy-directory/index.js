const path = require('path');
const { mkdir, copyFile, readdir, unlink } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'files');
const pathToNewFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {

    await mkdir(pathToNewFolder, { recursive: true });

    const filesCopy = await readdir(pathToNewFolder, {
      encoding: 'utf8',
      withFileTypes: true,
    });
    for (const fileCopy of filesCopy) {
      await unlink(path.join(pathToNewFolder, fileCopy.name));
    }

    const files = await readdir(pathToFolder, {
      encoding: 'utf8',
      withFileTypes: true,
    });
    for (const file of files) {
      await copyFile(path.join(pathToFolder, file.name), path.join(pathToNewFolder, file.name));
    }

  } catch (err) {
    console.error(err);
  }
}

copyDir();