const babelConfig = {
  presets: ['@vue/app'],
  plugins: [],
};

if (process.env['NODE_ENV'] === 'test') {
  babelConfig.plugins.push('transform-require-context');
}

module.exports = babelConfig;
