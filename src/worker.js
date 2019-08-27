const { readFileSync, writeFileSync } = require('fs');

process.on('message', ({ filesChunk, classesMapping, mode, verbose }) => {
  let counter = 0;
  let changes = 0;
  for (const file of filesChunk) {
    if (verbose) counter++;

    let data = readFileSync(file, { encoding: 'utf8' });
    for (const [oldClass, newClass] of classesMapping) {
      const left = mode === 'forward' ? oldClass : newClass;
      const right = mode === 'forward' ? newClass : oldClass;

      if (data.includes(left)) {
        const newData = data.replace(new RegExp(left, 'g'), right);
        if(verbose && newData !== data) changes++;
        data = newData;
      }
    }

    writeFileSync(file, data, { encoding: 'utf8' });

    if (verbose && changes > 0) process.stdout.write(`file: ${file}, changes: ${changes}, ${counter++}/${filesChunk.length}\n`);
  }

  process.exit(0);
});
