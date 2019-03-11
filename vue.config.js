const webpack = require('webpack');

module.exports = {
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
    plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
  },
};
