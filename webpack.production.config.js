const path = require('path');

module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/client/src/main.jsx'),

  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/client/dist/js'),
    filename: 'app.js',
  },

  module: {

    // apply loaders to files that meet given conditions
    loaders: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, '/client/src'),
      loader: 'babel-loader',
      query: {
        presets: ["react", "es2015"],
        plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-class-properties')]
      }
    }],
  },
  devtool: 'source-map',

  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: true
};