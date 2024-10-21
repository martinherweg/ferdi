import * as fs from 'fs';
import * as path from 'path';
import {it, describe, afterEach, beforeEach, expect} from "vitest";
import {execa} from "execa";

const outputDir = path.resolve(process.cwd(), 'output');

async function execCli(args: string) {
    console.log(`execCli outputDir ${outputDir}`);
    return execa({
        cwd: outputDir,
    })`pnpm exec tsx ${path.resolve(__dirname, '..', 'src', 'index.ts')} ${args}`;
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

    it('should generate files from templates', async () => {
        const {stdout: output} = await execCli('compiledTemplate');
        console.log(`${output}`)
        const compiledTemplateExists = fs.existsSync(path.resolve(outputDir, 'compiledTemplate.ts'));
        expect(compiledTemplateExists).toBe(true);
    })
})
