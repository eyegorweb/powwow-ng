module.exports = {
  configureWebpack: {
    output: {
      filename: '[name][hash].js',
      chunkFilename: '[name][hash].js',
    },
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
  },
};
