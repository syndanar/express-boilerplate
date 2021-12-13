module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "./node_modules/gts/"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
  },
};
