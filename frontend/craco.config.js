const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add .vue extension to resolve
      webpackConfig.resolve.extensions.push('.vue');

      // Completely exclude test files from webpack compilation
      // by modifying the oneOf rules to exclude test patterns
      if (webpackConfig.module.rules) {
        webpackConfig.module.rules.forEach((rule) => {
          if (rule.oneOf) {
            // Add exclusion pattern to all oneOf rules
            rule.oneOf.forEach((oneOfRule) => {
              if (oneOfRule.test && !oneOfRule.exclude) {
                oneOfRule.exclude = [];
              }
              if (oneOfRule.exclude && Array.isArray(oneOfRule.exclude)) {
                oneOfRule.exclude.push(/__tests__/);
                oneOfRule.exclude.push(/\.(test|spec)\.(ts|tsx|js|jsx)$/);
              } else if (oneOfRule.exclude) {
                oneOfRule.exclude = [
                  oneOfRule.exclude,
                  /__tests__/,
                  /\.(test|spec)\.(ts|tsx|js|jsx)$/,
                ];
              }
            });
          }
        });
      }

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

      // Ignore test files in watch mode
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/__tests__/**',
          '**/*.test.*',
          '**/*.spec.*',
        ],
      };

      return webpackConfig;
    },
  },
};
