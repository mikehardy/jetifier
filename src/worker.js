const { readFileSync, writeFileSync } = require('fs');

process.on('message', ({ filesChunk, classesMapping, mode, verbose }) => {
  let counter = 0;
  for (const file of filesChunk) {
    if (verbose) process.stdout.write(`file: ${file} ${counter++}/${filesChunk.length}\n`);

    let data = readFileSync(file, { encoding: 'utf8' });
    for (const [oldClass, newClass] of classesMapping) {
      const left = mode === 'forward' ? oldClass : newClass;
      const right = mode === 'forward' ? newClass : oldClass;

      if (data.includes(left)) {
        data = data.replace(new RegExp(left, 'g'), right);
      }
    }

    writeFileSync(file, data, { encoding: 'utf8' });
  }

  process.exit(0);
});
