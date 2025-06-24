/** biome-ignore-all lint/suspicious/noConsole: config */
import { build } from 'esbuild';

const options = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/index.bundled.js',
    banner: {
        js: '#!/usr/bin/env node\nimport { createRequire } from "module";\nconst require = createRequire(import.meta.url);',
    },
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
    metafile: true,
    // Node.js built-in modules should be external
    external: [
        'node:*',
        'fs',
        'path',
        'crypto',
        'stream',
        'util',
        'buffer',
        'events',
        'os',
        'child_process',
        'worker_threads',
        'module',
        'url',
        'process',
    ],
};

build(options)
    .then((result) => {
        if (result.metafile) {
            console.log('Build completed successfully');
            console.log(
                'Output size:',
                result.metafile.outputs['dist/index.bundled.js'].bytes,
                'bytes'
            );
        }
    })
    .catch(() => process.exit(1));
