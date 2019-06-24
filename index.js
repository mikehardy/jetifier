const { readFileSync, writeFileSync } = require('fs');
const { loadCSV, readDir } = require('./src/utils');

const arg = process.argv.slice(2)[0];
const mode = arg && arg === 'reverse' ? 'reverse' : 'forward';

const SEARCH_DIR = 'node_modules';

const csv = loadCSV();
const files = readDir(SEARCH_DIR);

for (const file of files) {
  let data = readFileSync(file, { encoding: 'utf8' });
  for (const c in csv) {
    if (data.includes(mode === 'forward' ? c : csv[c])) {
      console.log(`${mode}-jetifying: ${file}`);
      data = mode === 'forward' ? data.replace(new RegExp(c, 'g'), csv[c]) : data.replace(new RegExp(csv[c], 'g'), c);
      writeFileSync(file, data, { encoding: 'utf8' });
    }
  }
}