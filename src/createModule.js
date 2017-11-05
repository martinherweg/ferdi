const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const findUp = require('find-up');

const pkgPath = findUp.sync('package.json') || '';
const pkg = require(pkgPath) || {};

const store = memFs.create();
const fs = editor.create(store);

/**
 *
 * @param extension
 * @param config
 */
const createModule = ({
  name = 'module',
  kind,
  extension,
  config,
  pathOptions = null,
}) => {
  const basePath = path.resolve(process.cwd());
  // get module data to write files
  const moduleData = {
    moduleName: 'name',
    authors: pkg.authors,
    projectName: pkg.name,
    file: '',
  };
  const { files } = config;

  // function to copy a template file to a defined directory
  /**
   *
   * @param fileExtension
   * @returns {*}
   */
  const copyTpl = ({ fileExtension }) => {
    const templatePath = path.resolve(
      basePath + '/' + config.paths.templateBase,
    );

    let globRegex = `?(${kind}*)`;

    if (fileExtension.match(/scss/g)) {
      globRegex = `?(_${kind}*)`;
    }

    // get the template File
    const templateFile = glob.sync(globRegex, {
      cwd: templatePath,
      realpath: true,
    });

    let destinationPath = config.paths.modulePath;
    if (pathOptions) destinationPath = destinationPath + pathOptions.path;
    destinationPath = path.join(destinationPath, name);

    let filename = files[kind].name ? files[kind].name : path.basename(name);
    filename = filename + '.' + fileExtension;

    destinationPath = destinationPath + '/' + filename;

    console.log(destinationPath);

    // return fs.copyTpl(templateFile, `${destinationPath}`, moduleData);
  };

  if (typeof extension === Array) {
    extension.forEach(extension => copyTpl({ fileExtension: extension }));
  } else {
    copyTpl({ fileExtension: extension });
  }
  // console.log(`Filename: ${filename}`);
};

/**
 *
 * @param options
 * @param config
 */
const moduleCreation = ({ options, config }) => {
  const { files, paths } = config;
  const { pathOptions } = paths;
  Object.keys(files).forEach(file => {
    console.log(file);
    let destinationPathOption;
    if (options[file]) {
      console.log('File creation', file);
      Object.keys(pathOptions).forEach(path => {
        if (options[path]) {
          destinationPathOption = {
            key: path,
            path: pathOptions[path],
          };
        }
      });
      const module = files[file];
      createModule({
        name: options._[0],
        kind: file,
        extension: module.extension,
        config,
        pathOptions: destinationPathOption,
      });
    }
  });
};

module.exports = moduleCreation;
