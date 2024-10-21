import {cosmiconfigSync} from "cosmiconfig";
import * as tsNode from "ts-node";

tsNode.register({
    transpileOnly: true
})


/**
 * @interface Config
 * @member defaults - The keys here should be the same as in the files object
 * @member files - The keys here are translated to options in the cli so every file is also an indicator
 */
export interface Config {
    defaults: {
        [key: string]: boolean;
    };
    outputDirectory: string;
    templateDirectory: string;
    files: {
        [key: string]: {
            name: string;
            postfix: string;
            extension: string,
            description: string;
        }
    }
}

export function defineConfig(config: Config): Config {
    return config;
}

export function loadConfig(): Config {
    const explorerSync = cosmiconfigSync("ferdi");
    const result = explorerSync.search();

    if (!result || result.isEmpty) {
        throw new Error('No valid configuration file found');
    }

    return result.config;
}
