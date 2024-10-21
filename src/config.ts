import {cosmiconfig} from "cosmiconfig";
import * as tsNode from "ts-node";

tsNode.register({
    transpileOnly: true
})

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

export async function loadConfig(): Promise<Config> {
    const explorerSync = cosmiconfig("ferdi");
    const result = await explorerSync.search();

    if (!result || result.isEmpty) {
        throw new Error('No valid configuration file found');
    }

    return result.config;
}
