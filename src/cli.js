/**
 * Modlr CLI Configuration
 *
 * @package  modlr
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
const defaultConfig = require('./.modlrrc');

// get root of project
const MODLR_ROOT = path.resolve(__filename, '../', '../');
// set config filename and location
const CONFIG_FILE_NAME = './src/.modlrrc.js';
// check if the config file exists and load the path
const MODLR_CONFIG_FILE = fs.existsSync(
  path.resolve(MODLR_ROOT, CONFIG_FILE_NAME),
)
  ? path.resolve(MODLR_ROOT, CONFIG_FILE_NAME)
  : '';

// check for a user Config going up from where the command was used and get it's path
const userConfigPath = findUp.sync(['.modlrrc.js', '.modlrrc']);
let userConfig = require(userConfigPath) || {};

// if a user config is available use it and if not use the default Config
const config = userConfig !== undefined ? userConfig : defaultConfig;

// Main CLI Function
const modlr_fn = () => {
  // load files and paths from the config
  const { files, paths } = config;

  // empty object for path object
  // Loop through all Defined path Options in the Config file and save them to empty object.
  const pathOptions = {};
  Object.keys(paths.pathOptions).forEach(key => {
    pathOptions[key] = {};
    pathOptions[key].alias = key.charAt(0);
    pathOptions[key].description =
      'Modlr creates File at ' + paths.templateBase + key + '/';
    pathOptions[key].group = chalk`{bgCyan Path Options}`;
  });

  // CLI Interface with yargs
  const modlr = yargs
    .command({
      command: 'init',
      description: 'Copy the Config File',
      handler() {
        // copy Config File from Module to Project root
        try {
          fs.copySync(
            MODLR_CONFIG_FILE,
            process.cwd() + '/' + path.basename(MODLR_CONFIG_FILE),
            {
              overwrite: false,
              errorOnExist: true,
            },
          );
          console.log(
            chalk`{green modlr config File was copied to ${process.cwd()}/${path.basename(
              MODLR_CONFIG_FILE,
            )}}`,
          );
        } catch (error) {
          console.error(error);
        }
      },
    })
    .command({
      command: ['new', '*'],
      description: 'Create a new Module',
      handler: argv => {
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
    .options(files)
    .options(pathOptions)
    .help().argv;
};

module.exports = modlr_fn;
