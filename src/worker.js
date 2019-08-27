const { readFileSync, writeFileSync } = require('fs');

process.on('message', ({ filesChunk, classesMapping, mode, verbose }) => {
  let counter = 0;
  for (const file of filesChunk) {
    counter++;

    let changes = 0;
    let data = readFileSync(file, { encoding: 'utf8' });
    for (const [oldClass, newClass] of classesMapping) {
      const left = mode === 'forward' ? oldClass : newClass;
      const right = mode === 'forward' ? newClass : oldClass;

      if (data.includes(left)) {
        changes++;
        data = data.replace(new RegExp(left, 'g'), right);
      }
    }

    writeFileSync(file, data, { encoding: 'utf8' });

    if (verbose && changes > 0) process.stdout.write(`file: ${file}, changes: ${changes}, ${counter}/${filesChunk.length}\n`);
  }

  process.exit(0);
});
