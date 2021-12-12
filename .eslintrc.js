module.exports = {
  'env': {
    'es2021': true,
    'node': true,
    'browser': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2021,
    'sourceType': 'module',
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'off',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
  }
};