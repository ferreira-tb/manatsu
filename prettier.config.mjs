/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-css-order'],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  vueIndentScriptAndStyle: false
};
