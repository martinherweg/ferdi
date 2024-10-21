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
        }
    },
    defaults: {
        typescript: true
    }
});
