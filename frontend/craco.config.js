const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add .vue extension to resolve
      webpackConfig.resolve.extensions.push('.vue');

      // Add vue-loader rule BEFORE the oneOf rule
      webpackConfig.module.rules.unshift({
        test: /\.vue$/,
        loader: 'vue-loader',
      });

      // Add VueLoaderPlugin
      webpackConfig.plugins.push(new VueLoaderPlugin());

      // Add DefinePlugin for Vue feature flags
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        })
      );

      // Add alias for vue - use runtime+compiler version
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        vue: 'vue/dist/vue.esm-bundler.js',
      };

      return webpackConfig;
    },
  },
};
