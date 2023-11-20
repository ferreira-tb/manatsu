import * as path from 'node:path';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [vue(), dts({ rollupTypes: true })],
    build: {
        outDir: 'lib',
        emptyOutDir: true,
        lib: {
            entry: resolve(dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: (format) => {
                switch (format) {
                    case 'es':
                        return 'manatsu.mjs';
                    case 'cjs':
                        return 'manatsu.cjs';
                    default:
                        throw new Error(`Invalid format: ${format}`);
                }
            }
        },
        rollupOptions: {
            external: ['vue']
        }
    }
});
