const { fork } = require('child_process');
const { join } = require('path');
const { getClassesMapping, traverseNodeModules, readDir, chunk } = require('./src/utils');

const cpus = require('os').cpus().length;

const arg = process.argv.slice(2)[0];
const mode = arg && ((arg === 'reverse') || (arg === '-r')) ? 'reverse' : 'forward';

const classesMapping = getClassesMapping();
const files = [];
traverseNodeModules(process.cwd(), searchDir => {
  readDir(searchDir, files);
});

console.log(`Jetifier found ${files.length} file(s) to ${mode}-jetify. Using ${cpus} workers...`);

for (const filesChunk of chunk(files, cpus)) {
  const worker = fork(join(__dirname, 'src', 'worker.js'));
  worker.send({ filesChunk, classesMapping, mode });
}
