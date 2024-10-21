import {defineConfig} from './src/config';
export default defineConfig({
    outputDirectory: 'output',
    templateDirectory: 'templates',
    files: {
        typescript: {
            name: 'typescript',
            postfix: '',
            extension: 'ts',
            description: 'A simple typescript file'
        },
        html: {
            name: 'template',
            postfix: '',
            extension: 'twig',
            description: 'A simple twig file'
        },
        svelte: {
            name: 'svelte',
            postfix: '',
            extension: 'svelte',
            description: 'A simple svelte file'
        }
    },
    defaults: {
        typescript: true,
        svelte: true,
        template: false,
    }
});
