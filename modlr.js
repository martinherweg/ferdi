#!/usr/bin/env node
const program = require('yargs');
const path = require('path');
const merge = require('deepmerge');
const searchConfig = require('./src/searchConfig');
const moduleCreation = require('./src/moduleCreation');

const init = async function() {
  const currentDir = process.cwd();
  const configFilename = await searchConfig(currentDir);
  const { moduleCreator } = require(configFilename) || '';
  const configFileIsThere = typeof moduleCreator === 'object';
  console.log(configFileIsThere);
  const templateFolder = configFileIsThere
    ? moduleCreator.templateFolder
    : './moduleTemplates';
  const searchFolder = configFileIsThere ? currentDir : __dirname;
  console.log(templateFolder);
  const paths = {
    templateBase: path.resolve(searchFolder, templateFolder) + '/',
  };
  const defaultConfig = {
    templateExtension: '.html',
    scriptExtension: '.js',
    cssExtension: '.css',
    templateFiles: {
      html: paths.templateBase + '_template.tmpl.html',
      js: paths.templateBase + '_script.tmpl.js',
      css: paths.templateBase + '_css.tmpl.css',
    },
  };
  const config = merge(defaultConfig, moduleCreator);

  console.log(config);
};

init();
