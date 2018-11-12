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
    apollo: {
      enableMocks: false,
      enableEngine: false,
    },
  },
};
