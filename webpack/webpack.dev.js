const { merge } = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',
  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 8180,
  },

});
