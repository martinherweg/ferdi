const yargs = require('yargs');
const chalk = require('chalk');
const findUp = require('find-up');
const merge = require('deepmerge');

const defaultConfig = require('./.modlrrc');
const userConfigPath = findUp.sync(['.modlrrc.js', '.modlrrc', 'package.json']);
const userConfig = require(userConfigPath) || {};

if (!userConfig) {
  console.warn(
    chalk`{Module gets created with default Templates and Paths, please create a config file if you want to define your own.}`,
  );
}

const config = merge(defaultConfig, userConfig);

const modlr_fn = () => {
  const { defaults } = config;
  const modlr = yargs
    .option('html', {
      alias: ['template', 'view'],
      group: chalk`{bgCyan Template}`,
      default: defaults.html,
      boolean: true,
      describe: 'Modlr should create a Template File',
    })
    .option('css', {
      alias: ['style', 'scss'],
      group: chalk`{bgCyan CSS}`,
      default: defaults.css,
      boolean: true,
      describe: 'Modlr should create CSS / SCSS / SASS / Stylus / LESS File',
    })
    .option('js', {
      alias: ['javascript', 'JS'],
      group: chalk`{bgCyan JavaScript}`,
      default: defaults.javascript,
      boolean: true,
      describe: 'Modlr should create JavaScript File',
    })
    .option('Vue', {
      alias: 'vue',
      group: chalk`{bgCyan Vue}`,
      default: defaults.javascript,
      boolean: true,
      describe: 'Modlr should create Vue.js SFC',
    })
    .option('config', {
      alias: 'fractal',
      group: chalk`bgCyan Fractal Config`,
      boolean: true,
      describe: 'Modlr should create a Fractal Config File',
    })
    .help().argv;

  const options = {
    html: modlr.html || modlr.template,
    css: modlr.css || modlr.style || modlr.scss,
    javascript: modlr.javascript || modlr.JS || modlr.js,
    vue: modlr.vue || modlr.Vue,
    fractal: modlr.config || modlr.fractal,
  };

  console.log(options);
};

module.exports = modlr_fn;
