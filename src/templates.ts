import * as fs from 'fs';
import * as path from 'path';
export async function createFilesFromTemplates(filename: string, outputDir: string) {
    const directory = path.resolve(process.cwd(), outputDir);
    console.log('createFilesFromTemplates', directory);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.cpSync(path.resolve('src', 'templates', `typescript.ts`), path.resolve(directory, `${filename}.ts`));
}
