const fs = require('fs');
const path = require('path');
const { mkdir, copyFile, readdir, rm, stat, readFile, writeFile } = require('fs/promises');

const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToNewAssets = path.join(__dirname, 'project-dist', 'assets');
const pathToComponents = path.join(__dirname, 'components');

(async function () {
  try {
    await createFolder();
    await Promise.all([
      copyFilesToFolder(pathToAssets, pathToNewAssets),
      createBundle(),
      createHTMLFile(),
    ]);
  } catch (err) {
    console.log(err.message);
  }
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

async function readData() {
  try {
    const files = await readdir(pathToComponents, {
      encoding: 'utf8',
      withFileTypes: true,
    });

    const dataStore = {};

    for (const file of files) {
      if (file.isFile()) {
        const data = await readFile(path.join(pathToComponents, file.name), 'utf-8');
        dataStore[file.name] = data;
      }
    }

    return dataStore;

  } catch (err) {
    console.log(err.message);
  }
}

async function createHTMLFile() {
  const componentsData = await readData();

  let templateData = await readFile(path.join(__dirname, 'template.html'), 'utf-8');

  for (const [key, value] of Object.entries(componentsData)) {
    templateData = templateData.replace(new RegExp(`{{${path.basename(key, '.html')}}}`, 'g'), value);
  }

  writeFile(path.join(__dirname, 'project-dist', 'index.html'), `${templateData}`);
}