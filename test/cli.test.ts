import * as fs from 'fs';
import * as path from 'path';
import {it, describe, afterEach, beforeEach, expect} from "vitest";
import {execa} from "execa";

const outputDir = path.resolve(process.cwd(), 'output');

async function execCli(command: string, options: string = '') {
    const commandArguments = options.length > 0 ? [options] : [];
    return execa({
        cwd: outputDir,
    })`pnpm exec tsx ${path.resolve(__dirname, '..', 'src', 'index.ts')} ${command} ${commandArguments}`;
}

describe('ferdi', () => {
    beforeEach(() => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }
    })

    afterEach(() => {
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
    })

    it('should generate files for every default option from templates', async () => {
        const {stdout: output} = await execCli('compiledTemplate');
        const typeScriptFileExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.ts'));
        expect(typeScriptFileExists).toBe(true);
        const svelteFileExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.svelte'));
        expect(svelteFileExists).toBe(true);
        const templateFileDoesnExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.twig'));
        expect(templateFileDoesnExists).toBe(false);
    })


    it('should generate files for every default option and provided from templates', async () => {
        const {stdout: output} = await execCli('compiledTemplate', '--html');
        const typeScriptFileExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.ts'));
        expect(typeScriptFileExists).toBe(true);
        const svelteFileExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.svelte'));
        expect(svelteFileExists).toBe(true);
        const templateFileDoesnExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.twig'));
        expect(templateFileDoesnExists).toBe(true);
    })

    it('should have a help function', async () => {
        const {stdout: output} = await execCli('--help');
        console.log(output);
    })
})
