/** biome-ignore-all lint/suspicious/noConsole: config */
import { build } from 'esbuild';
import { mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';

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

async function buildWithCopy() {
    try {
        // distディレクトリを作成（存在しない場合）
        if (!existsSync('dist')) {
            await mkdir('dist', { recursive: true });
        }

        // esbuildでビルド実行
        const result = await build(options);

        // fincode-openapi.ymlをdistにコピー
        await copyFile('fincode-openapi.yml', 'dist/fincode-openapi.yml');

        if (result.metafile) {
            console.log('Build completed successfully');
            console.log(
                'Output size:',
                result.metafile.outputs['dist/index.bundled.js'].bytes,
                'bytes'
            );
        }
        console.log('fincode-openapi.yml copied to dist/');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildWithCopy();