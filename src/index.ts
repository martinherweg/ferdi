import cac from "cac";
import * as path from "path";
import {loadConfig} from "./config";
import {createFilesFromTemplates} from "./templates";

const cli = cac('ferdi');

cli
    .command('[...files]', 'Generate files from templates')
    .action(async (filename) => {
        const config = await loadConfig();
        for (const file of filename) {
            await createFilesFromTemplates(file, config.outputDirectory);
        }
        return config;
    });

cli.help();
cli.parse();
