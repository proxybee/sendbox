const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

module.exports = {
  target: 'node',
  // Where webpack looks to start building the bundle
  entry: [`${paths.src}/index.js`],
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Sendbox Backend',
    }),
  ],
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['*', '.js']
  },
  // resolve: {
  //   modules: [
  //     paths.src,
  //     'node_modules',
  //   ],
  //   extensions: ['*', '.js'],
  //   alias: {
  //     '@': paths.src,
  //     assets: paths.public,
  //   },
  // fallback: paths.fallback,
  // },
};
