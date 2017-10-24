const yargs = require('yargs');
const chalk = require('chalk');
const findUp = require('find-up');
const merge = require('deepmerge');

const createModule = require('./createModule');

const defaultConfig = require('./.modlrrc');
const userConfigPath = findUp.sync(['.modlrrc.js', '.modlrrc']);
let userConfig = {};

if (!userConfigPath) {
  console.warn(
    chalk`{bgRed Module gets created with default Templates and Paths, please create a config file if you want to define your own.}`,
  );
} else {
  userConfig = require(userConfigPath);
}

const config = merge(defaultConfig, userConfig);
const modlr_fn = () => {
  const { files, paths } = config;

  const pathOptions = {};

  Object.keys(paths.pathOptions).forEach(key => {
    pathOptions[key] = {};
    pathOptions[key].alias = key.charAt(0);
    pathOptions[key].description =
      'Modlr creates File at ' + paths.templateBase + key + '/';
    pathOptions[key].group = chalk`{bgCyan Path Options}`;
  });

  const modlr = yargs
    .command({
      command: 'copyConfig',
      handler() {
        // console.log(process);
      },
    })
    .options(files)
    .options(pathOptions)
    .help().argv;

  const trueOptions = Object.keys(modlr).reduce((r, e) => {
    if (modlr[e]) r[e] = modlr[e];
    return r;
  }, {});

  console.log(trueOptions);

  // createModule({ options: modlr, config });
};

module.exports = modlr_fn;
