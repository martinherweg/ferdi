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

import glob from 'glob';
import chalk from 'chalk';
import {addedDiff, deletedDiff, detailedDiff, diff, updatedDiff} from 'deep-object-diff';
import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import { findUpSync } from 'find-up';
import {fileURLToPath} from 'node:url';
import _ from 'lodash';
const store = memFs.create();
const fs = editor.create(store);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  flat = false
}) => {
  let basePath = findUpSync(['.ferdirc.js', '.ferdirc']);

  if (!basePath) {
    console.error('Please create a config file named .ferdirc.js or .ferdirc in your project root');
    process.exit();
  }

  basePath = path.dirname(basePath);
  const files = config.default?.files ?? config.files;

  // function to copy a template file to a defined directory
  /**
   *
   * @param fileExtension
   * @returns {*}
   */
  const copyTpl = ({
    fileExtension
  }) => {
    const templatePathBase = config.default?.paths?.templateBase ?? config.paths.templateBase
    const templatePath = path.resolve(`${basePath}/${templatePathBase}`);

    let globRegex = `?(*${kind}-*)`;

    if (kind === 'template') {
      globRegex = `?(${kind}-*)`;
    }

    // get the template File

    const templateFile = glob.sync(globRegex, {
      cwd: templatePath,
      realpath: true
    });

    let destinationPath = config.default?.paths.modulePath ?? config.paths.modulePath;
    if (pathOptions) destinationPath += pathOptions.path;

    const splitName = flat ? name.split('/') : name;
    let fileName = '';

    if (flat) {
      fileName = splitName.pop();
    }

    destinationPath = !flat ? path.join(destinationPath, name) : path.join(destinationPath, splitName.join('/'));
    // console.log(files[kind]);
    let filename = files[kind].name ? files[kind].name : `${path.basename(name)}${files[kind].postfix ? `${files[kind].postfix}` : ''}`;

    filename = `${filename}.${fileExtension}`;
    if (fileExtension.match(/scss/g) && !files[kind].name) {
      filename = ''.concat('_', filename);
    }

    destinationPath = `${basePath}/${destinationPath}/${filename}`;
    // get module data to write files
    const moduleData = config.default?.fileHeader ?? config.fileHeader ?? {};
    moduleData.moduleName = path.basename(name);
    moduleData.file = filename;
    moduleData.modulePath = name;

    if (pathOptions) {
      moduleData.pathOptions = pathOptions;
    }

    // console.log(JSON.stringify({
    //   name,
    //   filename,
    //   destinationPath,
    // }, null, 2));

    try {
      fs.copyTpl(templateFile[0], `${destinationPath.replace('//', '/')}`, moduleData);
      console.log(chalk `\n{green File ${destinationPath.replace('//', '/')} was created}`);
    } catch (error) {
      console.error(`No Template File found for ${kind}`, `\n${error}`);
    }

    return fs.commit(done => done);
  };

  if (typeof extension === Array) {
    extension.forEach(extension => copyTpl({
      fileExtension: extension
    }));
  } else {
    copyTpl({
      fileExtension: extension
    });
  }
  // console.log(`Filename: ${filename}`);
};

/**
 *
 * @param options
 * @param config
 */
const moduleCreation = ({
  options,
  config
}) => {
  const files = config.default?.files ?? config.files;
  const paths = config.default?.paths ?? config.paths;
  const defaults = config.default?.defaults ?? config.defaults;
  const {
    pathOptions
  } = paths;
  let trueOptions = {};

  const filteredOptions = Object.keys(options).filter(option => options[option]);

  const noDefaults = filteredOptions.some(item => Object.keys(defaults).indexOf(item) >= 0);
  if (noDefaults) {
    trueOptions = options;
  } else {
    trueOptions = { ...options,
      ...defaults
    };
  }

  Object.keys(files).forEach(file => {
    let destinationPathOption;

    if (trueOptions[file]) {
      if (files[file].path) {
        destinationPathOption = {
          key: file,
          path: files[file].path
        };
      } else {
        Object.keys(pathOptions).forEach(path => {
          if (options[path]) {
            destinationPathOption = {
              key: path,
              path: pathOptions[path]
            };
          }
        });
      }

      const module = files[file];
      if (typeof options._[0] !== 'string') {
        console.error(`OPTIONS: ${JSON.stringify(trueOptions, null, 2)}`);
        console.error(chalk `{red First argument must always be the name of the module}`);
        return process.exit();
      }


      trueOptions._.forEach(thisModule => {
        createModule({
          name: thisModule,
          kind: file,
          extension: module.extension,
          config,
          pathOptions: destinationPathOption,
          flat: !!options.flat
        });
      })
    }
  });
};

export default moduleCreation;
