eslintConfig = {
   root: true,
   env: {
      node: true,
      browser: true,
      es6: true,
   },
   extends: ['eslint:recommended', 'next/core-web-vitals'],
   ignorePatterns: ['dist', '.eslintrc.js'],
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
         jsx: true,
      },
   },
   settings: {
      react: {
         version: 'detect',
      },
   },
   plugins: ['react-refresh', 'prettier'],
   rules: {
      'import/prefer-default-export': 0,
      'no-console': 'warn',
      'no-nested-ternary': 0,
      'no-underscore-dangle': 0,
      'no-unused-expressions': ['error', { allowTernary: true }],
      camelcase: 0,
      'react/self-closing-comp': 1,
      'react/jsx-filename-extension': [1, { extensions: ['.js', 'jsx'] }],
      'react/prop-types': 0,
      'react/destructuring-assignment': 0,
      'react/jsx-no-comment-textnodes': 0,
      'react/jsx-props-no-spreading': 0,
      'react/no-array-index-key': 0,
      'react/no-unescaped-entities': 0,
      'react/require-default-props': 0,
      'react/react-in-jsx-scope': 0,
      'linebreak-style': ['error', 'unix'],
      semi: ['error', 'always'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }],
   },
};
