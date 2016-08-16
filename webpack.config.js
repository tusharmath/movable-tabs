/**
 * Created by imamudin.naseem on 16/08/16.
 */
'use strict'

module.exports = {
  entry: ['./src/main.js'],
  devServer: {
    port: 4444
  },
  devtool: '#inline-source-map',
  output: {
    path: './.dist/src',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  }

}
