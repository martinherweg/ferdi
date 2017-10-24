const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');

const store = memFs.create();
const fs = editor.create(store);

/**
 *
 * @param extension
 * @param config
 */
const createModule = ({ extension, config }) => {
  const basePath = path.resolve(process.cwd());
  console.log(`BasePath: ${basePath}`);
  // function to copy a template file to a defined directory
  /**
   *
   * @param fileExtension
   * @returns {*}
   */
  const copyTpl = ({ fileExtension }) => {
    return fs.copyTpl(
      path.resolve(config.paths.templateBase, glob.sync(`+(${fileExtension})`)),
      `${template}`,
      moduleData,
    );
  };

  if (typeof extension === Array) {
    extension.forEach(extension => copyTpl({ fileExtension: extension }));
  } else {
    copyTpl({ fileExtension: extension });
  }
  console.log(`${filename}`);
};

/**
 * 
 * @param options
 * @param config
 */
const moduleCreation = ({ options, config }) => {
  const { files } = config;

  Object.keys(files).forEach(file => {
    if (options[file]) {
      const module = files[file];
      createModule({ extension: module.extension, config });
    }
  });
};

module.exports = moduleCreation;
