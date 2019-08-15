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

const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const yargs = require("yargs");
const chalk = require("chalk");
const findUp = require("find-up");
const merge = require("deepmerge");
const _ = require("lodash");

const createModule = require("./createModule");

// load the default config
const defaultConfig = require("./.ferdirc");

// get root of project
const ferdi_ROOT = path.resolve(__filename, "../", "../");
// set config filename and location
const CONFIG_FILE_NAME = "./src/.ferdirc.js";
// check if the config file exists and load the path
const ferdi_CONFIG_FILE = fs.existsSync(
  path.resolve(ferdi_ROOT, CONFIG_FILE_NAME)
)
  ? path.resolve(ferdi_ROOT, CONFIG_FILE_NAME)
  : "";

const TEMPLATE_FOLDER_NAME = "./src/templates";
const TEMPLATE_FOLDER = fs.existsSync(
  path.resolve(ferdi_ROOT, TEMPLATE_FOLDER_NAME)
)
  ? path.resolve(ferdi_ROOT, TEMPLATE_FOLDER_NAME)
  : "";

// check for a user Config going up from where the command was used and get it's path
const userConfigPath = findUp.sync([".ferdirc.js", ".ferdirc"]) || "";
let userConfig;
if (userConfigPath) {
  userConfig = require(userConfigPath);
}

// if a user config is available use it and if not use the default Config
const config = userConfig !== undefined ? userConfig : defaultConfig;

// Main CLI Function
const ferdi_fn = () => {
  // load files and paths from the config
  const { files, paths, defaults } = config;

  // empty object for path object
  // Loop through all Defined path Options in the Config file and save them to empty object.
  const pathOptions = {};
  Object.keys(paths.pathOptions).forEach(key => {
    pathOptions[key] = {};
    pathOptions[key].alias = key.charAt(0);
    pathOptions[
      key
    ].description = `ferdi creates File at ${paths.modulePath}${key}/`;
    pathOptions[key].group = chalk`{bgCyan Path Options}`;
  });

  const fileOptions = {};
  Object.keys(files).forEach(key => {
    fileOptions[key] = {};
    fileOptions[key].description = `ferdi creates a ${key}`;
    fileOptions[key].group = chalk`{bgCyan File Options}`;
  });

  // CLI Interface with yargs
  const ferdi = yargs
    .parserConfiguration({
      "populate--": true
    })
    .command({
      command: ["new", "*"],
      description: "Create a new Module",
      handler: argv => {
        if (!config)
          console.error(
            "Please use `ferdi init` to copy the config file to your project "
          );
        // use createModule function to create the new module.
        createModule({
          options: argv,
          config
        });
      }
    })
    .command({
      command: "init",
      description: "Copy the Config File to current Folder",
      handler() {
        // copy Config File from Module to Project root
        try {
          fs.copySync(
            ferdi_CONFIG_FILE,
            `${process.cwd()}/${path.basename(ferdi_CONFIG_FILE)}`,
            {
              overwrite: false,
              errorOnExist: true
            }
          );
          console.log(
            chalk`{green ferdi config File was copied to ${process.cwd()}/${path.basename(
              ferdi_CONFIG_FILE
            )}}`,
            "\nPlease add File templates to your template folder or use `ferdi copy` to copy some example Template Files to your Project"
          );
        } catch (error) {
          console.error(error);
        }
      }
    })
    .command({
      command: "copy",
      description: "Copy Example Templates to your Project",
      handler() {
        try {
          fs.copySync(
            TEMPLATE_FOLDER,
            `${process.cwd()}/${config.paths.templateBase}`,
            {
              overwrite: false,
              errorOnExist: true
            }
          );
          console.log(
            chalk`{green ferdi Templates were copied to ${process.cwd()}/${
              config.paths.templateBase
            }}`
          );
        } catch (error) {
          console.error(error);
        }
      }
    })
    .options(fileOptions)
    .options(pathOptions)
    .option("flat", {
      describe:
        "Create component Files in the Folder itself and not in a component named subfolder"
    })
    .help().argv;

  return ferdi;
};

module.exports = ferdi_fn;
