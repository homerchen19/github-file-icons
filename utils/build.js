const webpack = require('webpack');
const config = require('../webpack.config');

webpack(config, err => {
  if (err) throw err;
});
