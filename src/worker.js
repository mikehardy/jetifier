const { readFileSync, writeFileSync } = require('fs');

process.on('message', ({ filesChunk, classesMapping, mode }) => {

  console.log(`${mode}-jetifying ${filesChunk.length} file(s)...`);

  for (const file of filesChunk) {
    let data = readFileSync(file, { encoding: 'utf8' });
    for (const [oldClass, newClass] of classesMapping) {
      if (data.includes(mode === 'forward' ? oldClass : newClass)) {
        data = mode === 'forward' ?
          data.replace(new RegExp(oldClass, 'g'), newClass) :
          data.replace(new RegExp(newClass, 'g'), oldClass);
        writeFileSync(file, data, { encoding: 'utf8' });
      }
    }
  }

  console.log(`${mode}-jetified ${filesChunk.length} file(s)`);

  process.exit(0);
});
