module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'browser': true
  },
  'extends': 'eslint:recommended',
  'rules': {
    'no-unused-vars': 'off',
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
    'comma-spacing': ['error', {'before': false, 'after': true}],
    'no-console': ['error', { 'allow': ['warn', 'error'] }]
  }
};
