const path = require('path');
const fs = require('fs');

const imagesPath = path.join(global.__basedir, 'images');

async function fetchImageList() {
  return fs.readdirSync(imagesPath)
    .filter((f) => f.endsWith('.jpg') || f.endsWith('.png'));
}

module.exports = {
  fetchImageList
}