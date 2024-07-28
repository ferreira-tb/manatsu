import { join } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const dtsOptions = {
  rollupTypes: true,
  exclude: ['node_modules/**', 'dist/**', '**/*.{spec,test}.ts'],
};

export default defineConfig({
  root: __dirname,
  plugins: [dts(dtsOptions)],
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
    },
  },
});
