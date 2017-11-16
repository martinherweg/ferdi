/**
 * Create Module Function
 *
 * @package  ferdi
 * @author   Martin Herweg <martin@herweg.co>
 */

/*
|---------------------------------------------------
| createModule.js
|---------------------------------------------------
*/

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
  let basePath = findUp.sync(['.ferdirc.js', '.ferdirc']);

  if (!basePath) {
    console.error(
      'Please create a config file named .ferdirc.js or .ferdirc in your project root',
    );
    process.exit();
  }

  basePath = path.dirname(basePath);
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

    let globRegex = `?(*${kind}*)`;

    // get the template File

    const templateFile = glob.sync(globRegex, {
      cwd: templatePath,
      realpath: true,
    });

    let destinationPath = config.paths.modulePath;
    if (pathOptions) destinationPath = destinationPath + pathOptions.path;
    destinationPath = path.join(destinationPath, name);

    let filename = files[kind].name
      ? files[kind].name
      : `${path.basename(name)}${files[kind].postfix
          ? '-' + files[kind].postfix
          : ''}`;

    filename = `${filename}.${fileExtension}`;
    if (fileExtension.match(/scss/g) && !files[kind].name) {
      filename = ''.concat('_', filename);
    }

    destinationPath = basePath + '/' + destinationPath + '/' + filename;
    // get module data to write files
    const moduleData = config.fileHeader || {};
    moduleData.moduleName = path.basename(name);
    moduleData.file = filename;

    if (pathOptions) {
      moduleData.pathOptions = pathOptions;
    }

    try {
      fs.copyTpl(
        templateFile[0],
        `${destinationPath.replace('//', '/')}`,
        moduleData,
      );
      console.log(
        chalk`\n{green File ${destinationPath.replace('//', '/')} was created}`,
      );
    } catch (error) {
      console.error('No Template File found for ' + kind, '\n' + error);
    }

    return fs.commit(done => {
      return done;
    });
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
    let destinationPathOption;
    if (options[file]) {
      Object.keys(pathOptions).forEach(path => {
        if (options[path]) {
          destinationPathOption = {
            key: path,
            path: pathOptions[path],
          };
        }
      });
      const module = files[file];

      if (typeof options._[0] != 'string') {
        console.error(
          chalk`{red First argument must always be the name of the module}`,
        );
        return process.exit();
      }
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
