const { fork } = require('child_process');
const { join } = require('path');
const commander = require('commander');
const glob = require('glob');
const { getClassesMapping, getFilesList, chunk } = require('./src/utils');

const cpus = require('os').cpus().length;

commander
  .option('-r, --reverse', 'Run Jetifier in reverse mode', false)
  .option('-g, --glob <glob>', 'Glob pattern to run Jetifier on', 'node_modules/**/*');

commander.parse(process.argv);

const mode = commander.reverse ? 'reverse' : 'forward';

const classesMapping = getClassesMapping();

glob(commander.glob, { nodir: true }, function (err, files) {
  if (err)
    throw err;

  const filesList = getFilesList(files);

  console.log(`Jetifier found ${filesList.length} file(s) to ${mode}-jetify. Using ${cpus} workers...`);

  for (const filesChunk of chunk(filesList, cpus)) {
    const worker = fork(join(__dirname, 'src', 'worker.js'));
    worker.send({ filesChunk, classesMapping, mode });
  }
});

