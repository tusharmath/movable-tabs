/**
 * Created by imamudin.naseem on 16/08/16.
 */
'use strict'

module.exports = {
  entry: ['./src/component.js'],
  devServer: {
    port: 4444
  },
  output: {
    path: './.dist/src',
    publicPath: '/',
    filename: 'component.js'
  }
}
