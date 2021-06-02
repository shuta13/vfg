module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  globals: {
    figma: 'readonly',
    __html__: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
