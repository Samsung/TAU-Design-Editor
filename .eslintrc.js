/* global module */
/*eslint quotes: [2, 'double']*/

module.exports = {
  'rules': {
    'indent': [2, 4],
    // Does not require function to have a name
    'func-names': 0,
    //'max-len': [2, 150],
    // good: {a: 1} bad: { a: 1 }
    'object-curly-spacing': [2, 'never'],
    'consistent-return': 2,
    'comma-dangle': [2, 'never'],
    'one-var': 0,
    'no-var': 0,
    'object-shorthand': 0,
    'no-underscore-dangle': 0,
    'prefer-arrow-callback': 0,
    'prefer-template': 0,
    'no-unused-vars': 0,
    'no-trailing-spaces': 0,
    'init-declarations': 0,
    'key-spacing': 0,
    'no-mixed-spaces-and-tabs': 0,
    'no-param-reassign': 0,
    'no-console': 0,
    'padded-blocks': 0,
    'max-len': 0,
    'one-var-declaration-per-line': 0,
    'dot-notation': 0,
    'prefer-rest-params': 0,
    'quote-props': 0,
    'default-case': 0,
    'camelcase': 0,
    'no-cond-assign': 0,
    'new-cap': 0,
    'no-loop-func': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/no-amd': 0,
    'import/extensions': 0,
    'import/no-dynamic-require': 0,
    'no-multi-str': 0,
    'no-template-curly-in-string': 0,
    'import/prefer-default-export': 0,
    'global-require': 0,
    'class-methods-use-this': 0,
    'prefer-destructuring': 0
  },
  'env': {
    'es6': true,
    'node': true,
    'browser': true
  },
  'globals': {
      'atom': true,
      'Promise':true,
      'define': true,
      'WeakMap': true,
      'tizen': true,
      'tau': true,
      'describe': true,
      'it': true
  },
  'extends': 'airbnb',
  'ecmaFeatures': {
    'sourceType': 'module'
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'experimentalObjectRestSpread': true
    }
  }
};
