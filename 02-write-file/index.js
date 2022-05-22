const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const pathToText = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(pathToText);

stdout.write('Можете вводить текст\n');

stdin.on('data', data => {
  if (String(data).trim() === 'exit') {
    process.exit();
  }
  output.write(data);
});

process.on('exit', () => {
  console.log('Пока!');
});

process.on('SIGINT', () => {
  process.exit();
});