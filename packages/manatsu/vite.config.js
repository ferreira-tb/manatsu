import prettier from 'prettier';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { basename, join } from 'node:path';
import { writeFile } from 'node:fs/promises';

const dtsOptions = {
  rollupTypes: false,
  exclude: ['node_modules/**', 'dist/**', '**/*.{spec,test}.ts'],
  afterBuild: async (map) => {
    const dts = Array.from(map).find(([filePath]) => {
      return basename(filePath) === 'index.d.ts';
    });

    if (!dts) {
      throw new Error('could not find index.d.ts file.');
    }

    let [filePath, content] = dts;

    // https://regex101.com/r/LomJCS
    const packageRegex = /@manatsu\/([a-z-]+)\/src\/index\.ts/gm;
    content = content.replace(packageRegex, './$1');

    content = await prettier.format(content, {
      parser: 'babel-ts',
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      endOfLine: 'lf',
      semi: true,
      singleQuote: false,
      trailingComma: 'none',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'always',
    });

    await writeFile(filePath, content);
  },
};

export default defineConfig({
  root: __dirname,
  plugins: [vue(), dts(dtsOptions)],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', 'vue-router', /^@vueuse/, /^@tauri-apps/, /^@tb-dev/],
      output: {
        chunkFileNames: '[name].js',
        manualChunks: {
          composables: ['@manatsu/composables/src/index.ts'],
          'tauri-plugin': ['@manatsu/tauri-plugin/src/index.ts'],
          'vue-plugin': ['@manatsu/vue-plugin/src/index.ts'],
        },
      },
    },
  },
});
