module.exports = {
   extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
   plugins: ['react'],
   parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
   },
   rules: {
      'no-unused-vars': 1,
      'no-undef': 1,
      'import/prefer-default-export': 0,
      'no-console': 'warn',
      'no-nested-ternary': 0,
      'no-underscore-dangle': 0,
      'no-unused-expressions': 0,
      camelcase: 0,
      'react/self-closing-comp': 1,
      'react/jsx-filename-extension': [
         1,
         {
            extensions: ['.js', '.jsx'],
         },
      ],
      'react/prop-types': 0,
      'react/destructuring-assignment': 0,
      'react/jsx-no-comment-textnodes': 0,
      'react/jsx-props-no-spreading': 0,
      'react/no-array-index-key': 0,
      'react/no-unescaped-entities': 0,
      'react/require-default-props': 0,
      'react/react-in-jsx-scope': 0,
      'linebreak-style': ['warn', 'unix'],
   },
};
