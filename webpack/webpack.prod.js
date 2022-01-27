const { merge } = require('webpack-merge');

const paths = require('./paths');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: paths.build,
    publicPath: '/',
    filename: 'js/[name].[contenthash].bundle.js',
  },

});
