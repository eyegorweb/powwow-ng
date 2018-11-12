module.exports = {
  root: true,

  env: {
    node: true,
    jest: true,
  },

  extends: ['plugin:vue/strongly-recommended', '@vue/prettier'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-trailing-spaces': 'error',
    'vue/require-default-prop': 0,
    'vue/html-quotes': [2, 'double'],
    'vue/this-in-template': [2, 'never'],
    'vue/no-spaces-around-equal-signs-in-attribute': 2,
    'vue/script-ident': {
      'script-indent': [
        'error',
        2,
        {
          baseIndent: 0,
          switchCase: 0,
          ignores: [],
        },
      ],
    },
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
};
