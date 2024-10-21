import {defineConfig} from 'vitest/config';

// configure vitest so it watches files in the src directory

export default defineConfig({
    test: {
        globals: true,
        environment: 'node'
    }
});
