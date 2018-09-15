const path = require('path');
const fs = require('fs');

/**
 * Get's extension of provided file
 * @param filename
 * @returns {*|string|*}
 */
exports.extension = function(filename) {
  if (!filename) {
    throw new Error('No filename provided');
  }

  return path.extname(filename);
};

/**
 * Appends the filename to the importing file
 * @param filename
 * @param importingFile
 */
exports.append = function({ filename, importingFile } = {}) {
  if (!importingFile) {
    throw new Error('No file to import to provided');
  }

  if (!filename) {
    throw new Error('No filename provided');
  }

  const extension = exports.extension(filename);

  if (!extension.match(/scss/)) {
    throw new Error(`Can't import in files other than SCSS`);
  }

  return fs.appendFileSync(
    importingFile,
    `
@import '${filename}';
`,
    'utf8',
  );
};
