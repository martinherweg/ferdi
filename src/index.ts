import cac from "cac";
import {loadConfig} from "./config";
import {createFilesFromTemplates} from "./templates";

const cli = cac('ferdi');
const config = loadConfig();

Object.keys(config.files).forEach((key) => {
   cli.option(`-${key.charAt(0)}, --${key}`, 'Generate ' + config.files[key].description);
});

cli
    .command('[...files]', 'Generate files from templates')
    .action(async (filename) => {
        for (const file of filename) {
            await createFilesFromTemplates(file, config.outputDirectory);
        }
        return config;
    });

cli.help();
cli.parse();
