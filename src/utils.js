const { existsSync, readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');
const verbose = process.argv.includes('--verbose');

const args = {};
process.argv.slice(2, process.argv.length).forEach(arg => {
  if (arg.slice(0, 2) === '--') { // long arg
    const longArg = arg.split('=');
    const longArgFlag = longArg[0].slice(2, longArg[0].length);
    const longArgValue = longArg.length > 1 ? longArg[1] : true;
    args[longArgFlag] = longArgValue;
  }
  else if (arg[0] === '-') { // flags
    const flags = arg.slice(1, arg.length).split('');
    flags.forEach(flag => { args[flag] = true })
  }
})
const defaultIncludes = join(__dirname, '..', 'mapping', 'androidx-includes.txt');
const defaultExcludes = join(__dirname, '..', 'mapping', 'androidx-excludes.txt');
const defaultMapping = join(__dirname, '..', 'mapping', 'androidx-class-mapping.csv');
const includesFile = args.includes ? args.includes : defaultIncludes;
const excludesFile = args.excludes ? args.excludes : defaultExcludes;
const mappingFile = args.mapping ? args.mapping : defaultMapping;

if (verbose) console.log(args)

const chunk = (array, chunkSize) => {
  const size = Math.ceil(array.length / chunkSize);
  const result = [];
  while (array.length) {
    result.push(array.splice(0, size));
  }
  return result;
};

const loadIncludesFromFile = () => {
  console.log(`Used include file: ${includesFile}`);

  const txtIncludes = includesFile;
  const lines = readFileSync(txtIncludes, { encoding: 'utf8' }).split(/\r?\n/);

  // sort by line length
  // exclude comments
  return lines
    .sort((a, b) => b.length - a.length)
    .filter(line => !line.startsWith('#'));
};

const loadExcludesFromFile = () => {
  console.log(`Used exclude file: ${excludesFile}`);

  const txtIncludes = excludesFile;
  const lines = readFileSync(txtIncludes, { encoding: 'utf8' }).split(/\r?\n/);

  // sort by line length
  // exclude comments
  return lines
    .sort((a, b) => b.length - a.length)
    .filter(line => !line.startsWith('#'));
};

const includes = loadIncludesFromFile()
const excludes = loadExcludesFromFile()

const readDir = (dir, filesList = []) => {
  const files = readdirSync(dir);

  for (let file of files) {
    const filePath = join(dir, file);

    // in list of excluded files
    const isExcluded = excludes.find(ex => filePath.includes(ex));
    if (isExcluded) {
      if (verbose) console.log(`Excluded: ${filePath}, ${isExcluded}`);
      continue;
    }

    if (existsSync(filePath)) {
      if (statSync(filePath).isDirectory()) {
        filesList = readDir(filePath, filesList);
      } else {
        const isIncluded = includes.find(include => filePath.includes(include));
        if (isIncluded) {
          filesList.push(filePath);
        }
      }
    }
  }
  return filesList;
};

const loadCSVFile = () => {
  console.log(`Used mapping file: ${mappingFile}`);

  const csvFilePath = mappingFile;
  const lines = readFileSync(csvFilePath, { encoding: 'utf8' }).split(/\r?\n/);

  // 1. Some mappings are substrings of other mappings, transform longest mappings first
  // 2.1. Remove redundant "Support Library class,Android X class" from array
  // 2.2. last element will always be an empty line so removing it from the array
  return lines
    .sort((a,b) => b.length - a.length) 
    .filter(line => line !== 'Support Library class,Android X class' && line.trim() !== '');
};

const getClassesMapping = () => {
  const csv = loadCSVFile();
  const result = [];
  for (let line of csv) {
    const oldValue = line.split(',')[0];
    const newValue = line.split(',')[1];
    result.push([oldValue, newValue]);
  }

  // renderscript must be added to the canonical androidx-class-mapping.csv - it is not upstream
  result.push(['android.support.v8.renderscript', 'android.renderscript']);

  return result;
};

module.exports = {
  getClassesMapping,
  readDir,
  chunk
};
