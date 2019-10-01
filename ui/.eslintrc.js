module.exports = {
  root: true,

  env: {
    node: true,
    jest: true,
  },

  extends: ['plugin:vue/strongly-recommended', '@vue/prettier', 'plugin:jest/recommended'],
  plugins: ['import'],

  rules: {
    // eslint
    'no-console': 'off',
    'no-debugger': 'off',
    'no-trailing-spaces': 'error',
    'object-shorthand': ['error', 'always'],
    'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],

    // vue specific
    'vue/require-default-prop': 0,
    'vue/html-quotes': [2, 'double'],
    'vue/this-in-template': [2, 'never'],
    'vue/no-spaces-around-equal-signs-in-attribute': 2,
    'vue/singleline-html-element-content-newline': 0,

    // prettier autoformat mieux le html dans vue
    'vue/max-attributes-per-line': 0,
    'vue/script-ident': {
      'script-indent': [
        'error',
        2,
        {
          baseIndent: 0,
          switchCase: 0,
          ignores: ['src/dep'],
        },
      ],
    },

    // jest
    'jest/consistent-test-it': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
};
