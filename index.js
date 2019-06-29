const { fork } = require('child_process');
const { join } = require('path');
const { getClassesMapping, readDir, chunk } = require('./src/utils');

const cpus = require('os').cpus().length;

const arg = process.argv.slice(2)[0];
const mode = arg && ((arg === 'reverse') || (arg === '-r')) ? 'reverse' : 'forward';
const SEARCH_DIR = 'node_modules';

const classesMapping = getClassesMapping();
const files = readDir(SEARCH_DIR);

console.log(`Found ${files.length} file(s)...`);

for (const filesChunk of chunk(files, cpus)) {
  const worker = fork(join(__dirname, 'src', 'worker.js'));
  worker.send({ filesChunk, classesMapping, mode });
}
