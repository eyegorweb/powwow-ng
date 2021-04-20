const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugin('CompressionPlugin').use(CompressionPlugin);
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import "@/theme/scss/_variables.scss";`,
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false,
      analyzerMode: 'static',
    },
  },

  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-sg|fr/),

      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
};
