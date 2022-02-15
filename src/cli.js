/**
 * ferdi CLI Configuration
 *
 * @package  ferdi
 * @author   Martin Herweg <martin@herweg.co>
 */

/*
|---------------------------------------------------
| cli.js
|---------------------------------------------------
*/

import util from 'util';
import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { findUpSync } from 'find-up';
import merge from 'deepmerge';
import _ from 'lodash';
import {fileURLToPath} from 'node:url';
import createModule from './createModule.js';
// load the default config
import defaultConfig from './.ferdirc.js';
const __filename = fileURLToPath(import.meta.url);
// get root of project
const ferdi_ROOT = path.resolve(__filename, '../', '../');
// set config filename and location
const CONFIG_FILE_NAME = './src/.ferdirc.js';
// check if the config file exists and load the path
const ferdi_CONFIG_FILE = fs.existsSync(path.resolve(ferdi_ROOT, CONFIG_FILE_NAME)) ? path.resolve(ferdi_ROOT, CONFIG_FILE_NAME) : '';

const TEMPLATE_FOLDER_NAME = './src/templates';
const TEMPLATE_FOLDER = fs.existsSync(path.resolve(ferdi_ROOT, TEMPLATE_FOLDER_NAME)) ? path.resolve(ferdi_ROOT, TEMPLATE_FOLDER_NAME) : '';

// check for a user Config going up from where the command was used and get it's path
const userConfigPath = findUpSync(['.ferdirc.js', '.ferdirc']) || '';
let userConfig;
if (userConfigPath) {
  userConfig = await import(userConfigPath);
}

// if a user config is available use it and if not use the default Config
const config = userConfig !== undefined ? userConfig : defaultConfig;

// Main CLI Function
const ferdi_fn = () => {
  // load files and paths from the config
  const files = config.default?.files ?? config.files;
  const paths = config.default?.paths ?? config.paths;
  const defaults = config.default?.defaults ?? config.defaults;

  // empty object for path object
  // Loop through all Defined path Options in the Config file and save them to empty object.
  const pathOptions = {};
  Object.keys(paths.pathOptions).forEach(key => {
    pathOptions[key] = {};
    pathOptions[key].alias = key.charAt(0);
    pathOptions[key].description = `ferdi creates File at ${paths.modulePath}${key}/`;
    pathOptions[key].group = chalk`{bgCyan Path Options}`;
  });

  const fileOptions = {};
  Object.keys(files).forEach(key => {
    fileOptions[key] = {};
    fileOptions[key].description = `ferdi creates a ${key}`;
    fileOptions[key].group = chalk`{bgCyan File Options}`;
  });

  // CLI Interface with yargs
  const ferdi = yargs(hideBin(process.argv))
    .parserConfiguration({
      'populate--': true,
    })
    .command({
      command: ['new', '*'],
      description: 'Create a new Module',
      handler: argv => {
        console.log(argv);
        if (!config) console.error('Please use `ferdi init` to copy the config file to your project ');
        // use createModule function to create the new module.
        createModule({
          options: argv,
          config
        });
      }
    })
    .command({
      command: 'init',
      description: 'Copy the Config File to current Folder',
      handler() {
        // copy Config File from Module to Project root
        try {
          fs.copySync(ferdi_CONFIG_FILE, `${process.cwd()}/${path.basename(ferdi_CONFIG_FILE)}`, {
            overwrite: false,
            errorOnExist: true
          });
          console.log(
            chalk`{green ferdi config File was copied to ${process.cwd()}/${path.basename(ferdi_CONFIG_FILE)}}`,
            '\nPlease add File templates to your template folder or use `ferdi copy` to copy some example Template Files to your Project'
          );
        } catch (error) {
          console.error(error);
        }
      }
    })
    .command({
      command: 'copy',
      description: 'Copy Example Templates to your Project',
      handler() {
        try {
          fs.copySync(TEMPLATE_FOLDER, `${process.cwd()}/${config.paths.templateBase}`, {
            overwrite: false,
            errorOnExist: true
          });
          console.log(chalk`{green ferdi Templates were copied to ${process.cwd()}/${config.paths.templateBase}}`);
        } catch (error) {
          console.error(error);
        }
      }
    })
    .options(fileOptions)
    .options(pathOptions)
    .option('flat', {
      describe: 'Create component Files in the Folder itself and not in a component named subfolder'
    })
    .help().argv;

  return ferdi;
};

export default ferdi_fn;
