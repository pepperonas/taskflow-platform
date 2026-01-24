const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add .vue extension to resolve
      webpackConfig.resolve.extensions.push('.vue');

      // Add vue-loader rule BEFORE the oneOf rule
      // This is required by vue-loader
      webpackConfig.module.rules.unshift({
        test: /\.vue$/,
        loader: 'vue-loader',
      });

      // Add VueLoaderPlugin
      webpackConfig.plugins.push(new VueLoaderPlugin());

      // Add alias for vue
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        vue: 'vue/dist/vue.esm-bundler.js',
      };

      return webpackConfig;
    },
  },
};
