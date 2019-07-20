const { fork } = require('child_process');
const { join, resolve } = require('path');
const { getClassesMapping, readDir, chunk } = require('./src/utils');

const cpus = require('os').cpus().length;

const args = process.argv.slice(2);
const mode = args.find(arg => (arg === 'reverse') || (arg === '-r')) ? 'reverse' : 'forward';
const monorepo = !!args.find(arg =>  arg === '--monorepo') || false;
const SEARCH_DIR = 'node_modules';

if (monorepo) {
  const projectPath = resolve('.');
  const packages = require('get-yarn-workspaces')(projectPath);
  const packagesSearchDir = packages.map(package => join(package, SEARCH_DIR));
  const packagesFiles = packagesSearchDir.reduce((acc, dir) => [...acc, ...readDir(dir)], []);
}

const classesMapping = getClassesMapping();
const files = [...readDir(SEARCH_DIR), ...packagesFiles];

console.log(`Jetifier found ${files.length} file(s) to ${mode}-jetify. Using ${cpus} workers...`);

for (const filesChunk of chunk(files, cpus)) {
  const worker = fork(join(__dirname, 'src', 'worker.js'));
  worker.send({ filesChunk, classesMapping, mode });
}
