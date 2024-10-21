"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cac_1 = require("cac");
var config_1 = require("./config");
var cli = (0, cac_1.default)('ferdi');
cli
    .command('', 'Generate files from templates')
    .action(function () {
    var config = (0, config_1.loadConfig)();
    return config;
});
cli.help();
cli.parse();
