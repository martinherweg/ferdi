import * as fs from 'fs';
import * as path from 'path';
import Mustache from 'mustache';

export async function createFilesFromTemplates({
                                                   filename,
                                                   outputDir,
                                                   type,
    extension
                                               }: {
    filename: string;
    extension: string;
    outputDir: string;
    type: string;
}) {
    const directory = path.resolve(process.cwd(), outputDir);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }

    const template = fs.readFileSync(path.resolve('src', 'templates', `${type}.${extension}`), 'utf-8');
    const data = {
        filename,
    }

    const output = Mustache.render(template, data);

    fs.writeFileSync(path.resolve(directory, `${filename}.${extension}`), output);
    console.log(`Generated ${filename}.${extension} in ${directory}`);
}
