const { readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

var readDir = (dir, filesList = []) => {
  const files = readdirSync(dir);
  for (let file of files) {
    if (statSync(dir + '/' + file).isDirectory()) {
      filesList = readDir(dir + '/' + file, filesList);
    }
    else {
      if (file.endsWith('.java') || file.endsWith('.xml') || file.endsWith('.kt')) {
        filesList.push(dir + '/' + file);
      }
    }
  }
  return filesList;
};

const loadCSV = () => {
  const csvFilePath = join(__dirname, 'androidx-class-mapping.csv');
  const lines = readFileSync(csvFilePath, { encoding: 'utf8' }).split('\n');
  const result = {};
  for (let line of lines) {
    const oldValue = line.split(',')[0];
    const newValue = line.split(',')[1];
    result[oldValue] = newValue;
  }

  // renderscript must be added to the canonical androidx-class-mapping.csv - it is not upstream
  result['android.support.v8.renderscript'] = 'android.renderscript';

  return result;
}

module.exports = {
  loadCSV,
  readDir
}
