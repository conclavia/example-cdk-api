module.exports = {
  env: { node: true, es2017: true },
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  overrides: [
    {
      files: ['**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'import',
    'jest',
    'prettier',
    'promise',
    'unicorn',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/extensions': ['error', { extension: 'never' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 'error',
    'no-new': 'off',
    'prettier/prettier': ['error'],
    'unicorn/filename-case': [
      'error',
      {
        case: 'camelCase',
      },
    ],
    'unicorn/import-style': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'eslint-comments/disable-enable-pair': 'off',
  },
};
