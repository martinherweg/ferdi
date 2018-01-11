module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    camelcase: 0,
    complexity: [2, 10],
    'no-console': 0,
    'no-bitwise': 2,
    eqeqeq: 2,
    'wrap-iife': 2,
    'no-empty': 2,
    'no-use-before-define': 2,
    'no-caller': 2,
    'no-new': 0,
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    quotes: [2, 'single'],
    strict: [2, 'global'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-undef': 2,
    'no-unused-vars': [
      'error',
      {
        args: 'none',
      },
    ],
    'max-len': [2, 220],
    'comma-style': [2, 'last'],
    'dot-notation': 2,
    'brace-style': [2, '1tbs', { allowSingleLine: false }],
    'one-var': [2, 'never'],
    'operator-linebreak': [2, 'after'],
    'space-infix-ops': 2,
    'space-before-blocks': [2, 'always'],
    'eol-last': 2,
    'new-cap': 'off',
    'no-new': 'off',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    indent: ['error', 2],
    'import/no-unresolved': 0,
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
      },
    ],
    'no-trailing-spaces': [
      'error',
      {
        skipBlankLines: true,
        ignoreComments: true,
      },
    ],
  },
};
