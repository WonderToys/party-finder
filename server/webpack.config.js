const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

// Config
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const config = {
  target: 'node',
  node: {
    __dirname: true
  },
  externals: [ nodeExternals() ],
  entry: './src/index.js',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.graphql$/,
        exclude: [ /node_modules/ ],
        loader: 'graphql-import-loader'
      },
      {
        test: /\.js$/,
        exclude: [ /node_modules/ ]
      }
    ]
  }
};

// Exports
module.exports = (env, argv) => {
  if ( IS_DEVELOPMENT === true || argv.mode === 'development' ) {
    config.mode = 'development';
  }
  if ( IS_PRODUCTION === true || argv.mode === 'production' ) {
    config.mode = 'production';
  }

  return config;
};