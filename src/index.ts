import cac from "cac";
import {loadConfig} from "./config";
import {createFilesFromTemplates} from "./templates";

const cli = cac('ferdi');
const config = loadConfig();


cli
    .command('[...files]', 'Generate files from templates')
    .action(async (filename, options) => {
        const defaults = Object.entries(config.defaults).filter(([key, value]) => value).map(([key]) => key);
        const optionsAsFiles = Object.keys(options).filter(option => Object.keys(config.files).includes(option));
        const optionsToCreate = [...defaults, ...optionsAsFiles]

        const defaultFiles = Object.entries(config.files).filter(([key, value]) => optionsToCreate.includes(key)).map(([key, value]) => {
            return {
                type: key,
                ...value,
            }
        });

        for (const file of filename) {
            for (const filesToCreateElement of defaultFiles) {
                await createFilesFromTemplates({
                    filename: file,
                    extension: filesToCreateElement.extension,
                    type: filesToCreateElement.type,
                    outputDir: config.outputDirectory,
                });
            }
        }
        return config;
    });

Object.keys(config.files).forEach((key) => {
    cli.option(`-${key.charAt(0)}, --${key}`, 'Generate ' + config.files[key].description);
});


cli.help();
cli.parse();
