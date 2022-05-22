const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const pathToText = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(pathToText, 'utf-8');

stream.pipe(stdout);