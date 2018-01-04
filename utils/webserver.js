const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const env = require('./env');
const config = require('../webpack.config');

const options = config.chromeExtensionBoilerplate || {};
const excludeEntriesToHotReload = options.notHotReload || [];

Object.keys(config.entry).forEach(entryName => {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      `webpack-dev-server/client?http://localhost:${
        env.PORT
      }webpack/hot/dev-server`,
    ].concat(config.entry[entryName]);
  }
});

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../build'),
  headers: { 'Access-Control-Allow-Origin': '*' },
});

server.listen(env.PORT);
