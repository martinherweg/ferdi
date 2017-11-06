/**
 * moduli CLI Configuration
 *
 * @package  moduli
 * @author   Martin Herweg <martin@herweg.co>
 */

/*
|---------------------------------------------------
| cli.js
|---------------------------------------------------
*/

const util = require('util');
const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs');
const chalk = require('chalk');
const findUp = require('find-up');
const merge = require('deepmerge');

const createModule = require('./createModule');

// load the default config
const defaultConfig = require('./.modulirc');

// get root of project
const moduli_ROOT = path.resolve(__filename, '../', '../');
// set config filename and location
const CONFIG_FILE_NAME = './src/.modulirc.js';
// check if the config file exists and load the path
const moduli_CONFIG_FILE = fs.existsSync(
  path.resolve(moduli_ROOT, CONFIG_FILE_NAME),
)
  ? path.resolve(moduli_ROOT, CONFIG_FILE_NAME)
  : '';

const TEMPLATE_FOLDER_NAME = './src/templates';
const TEMPLATE_FOLDER = fs.existsSync(
  path.resolve(moduli_ROOT, TEMPLATE_FOLDER_NAME),
)
  ? path.resolve(moduli_ROOT, TEMPLATE_FOLDER_NAME)
  : '';

// check for a user Config going up from where the command was used and get it's path
const userConfigPath = findUp.sync(['.modulirc.js', '.modulirc']) || '';
let userConfig;
if (userConfigPath) {
  userConfig = require(userConfigPath);
}

// if a user config is available use it and if not use the default Config
const config = userConfig !== undefined ? userConfig : defaultConfig;

// Main CLI Function
const moduli_fn = () => {
  // load files and paths from the config
  const { files, paths } = config;

  // empty object for path object
  // Loop through all Defined path Options in the Config file and save them to empty object.
  const pathOptions = {};
  Object.keys(paths.pathOptions).forEach(key => {
    pathOptions[key] = {};
    pathOptions[key].alias = key.charAt(0);
    pathOptions[key].description =
      'moduli creates File at ' + paths.templateBase + key + '/';
    pathOptions[key].group = chalk`{bgCyan Path Options}`;
  });

  // CLI Interface with yargs
  const moduli = yargs
    .command({
      command: ['new', '*'],
      description: 'Create a new Module',
      handler: argv => {
        if (!config)
          console.error(
            'Please use `moduli init` to copy the config file to your project ',
          );

        const trueOptions = Object.keys(argv).reduce((r, e) => {
          if (argv[e]) r[e] = argv[e];
          return r;
        }, {});

        // use createModule function to create the new module.
        createModule({
          options: trueOptions,
          config,
        });
      },
    })
    .command({
      command: 'init',
      description: 'Copy the Config File',
      handler() {
        // copy Config File from Module to Project root
        try {
          fs.copySync(
            moduli_CONFIG_FILE,
            process.cwd() + '/' + path.basename(moduli_CONFIG_FILE),
            {
              overwrite: false,
              errorOnExist: true,
            },
          );
          console.log(
            chalk`{green moduli config File was copied to ${process.cwd()}/${path.basename(
              moduli_CONFIG_FILE,
            )}}`,
            '\nPlease add File templates to your template folder or use `moduli copy` to copy some example Template Files to your Project',
          );
        } catch (error) {
          console.error(error);
        }
      },
    })
    .command({
      command: 'copy',
      description: 'Copy Example Templates to your Project',
      handler() {
        try {
          fs.copySync(
            TEMPLATE_FOLDER,
            process.cwd() + '/' + config.paths.templateBase,
            {
              overwrite: false,
              errorOnExist: true,
            },
          );
          console.log(
            chalk`{green moduli Templates were copied to ${process.cwd()}/${config
              .paths.templateBase}}`,
          );
        } catch (error) {
          console.error(error);
        }
      },
    })
    .options(files)
    .options(pathOptions)
    .help().argv;
};

module.exports = moduli_fn;
