import { defineConfig } from '@tb-dev/eslint-config';

export default defineConfig({
  project: [
    'tsconfig.json',
    'packages/composables/tsconfig.json',
    'packages/manatsu/tsconfig.json',
    'packages/shared/tsconfig.json',
    'packages/tauri-plugin/tsconfig.json',
    'packages/vue-plugin/tsconfig.json',
  ],
  overrides: {
    javascript: {
      'no-undefined': 'off',
    },
    typescript: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
});
