const _ = require('lodash');
const path = require('path');
const Webpack = require('webpack');
const project = require('../../package.json');
const externalModules = require('./externals');

module.exports = externalModules.then((externals) => {
  externals.compatible.bluebird = true;
  externals.compatible.ejs = true;
  externals.compatible.express = true;
  externals.compatible['express-jwt'] = true;
  externals.compatible.lodash = 'lodash@3.10.1';
  externals.compatible['tough-cookie'] = 'tough-cookie@2.2.2';
  externals.compatible.morgan = true;
  externals.compatible.qs = true;
  externals.compatible.superagent = true;
  externals.compatible.winston = true;
  externals.compatible.auth0 = 'auth0@2.1.0';
  externals.compatible.jsonwebtoken = true;
  externals.compatible.request = 'request@2.67.0';
  externals.compatible['mime-db'] = true;
  externals.compatible['body-parser'] = true;
  externals.compatible.auth0 = 'auth0@2.4.0';
  externals.compatible['auth0-oauth2-express'] = 'auth0-oauth2-express@1.1.5';
  externals.compatible.nconf = true;
  externals.compatible['auth0-extension-express-tools'] = 'auth0-extension-express-tools@2.0.0';
  externals.compatible['lru-memoizer'] = 'lru-memoizer@1.10.0';
  externals.compatible['auth0-extension-tools'] = 'auth0-extension-tools@1.0.0';
  externals.compatible['node-uuid'] = true;
  externals.compatible.jade = true;
  externals.compatible.jsonwebtoken = true;
  externals.compatible.debug = true;
  externals.compatible['deep-extend'] = true;
  externals.compatible['body-parser'] = true;
  externals.compatible['mime-types'] = true;
  externals.compatible['webtask-tools'] = true;

  // Transform to commonjs.
  Object.keys(externals.compatible).forEach(k => {
    if (externals.compatible[k] === true) {
      externals.compatible[k] = `commonjs ${k}`;
    } else {
      externals.compatible[k] = `commonjs ${externals.compatible[k]}`;
    }
  });

  return {
    entry: path.join(__dirname, '../../webtask'),
    target: 'node',
    output: {
      path: './dist',
      filename: `auth0-deploy-cli.extension.${project.version}.js`,
      library: true,
      libraryTarget: 'commonjs2'
    },
    externals: externals.compatible,
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: path.join(__dirname, '../../node_modules/')
        },
        { test: /\.json$/, loader: 'json' }
      ]
    },
    plugins: [
      new Webpack.IgnorePlugin(/cls-bluebird/, /request-promise/),
      new Webpack.optimize.DedupePlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }),
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          CLIENT_VERSION: JSON.stringify(project.version)
        }
      })
    ],
    resolve: {
      modulesDirectories: [ 'node_modules', path.join(__dirname, '../../node_modules/') ],
      root: __dirname,
      alias: {}
    },
    node: false
  };
});
