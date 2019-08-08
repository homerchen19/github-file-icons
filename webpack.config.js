const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

const options = {
  entry: {
    content: path.join(__dirname, 'src', 'js', 'content.js'),
    background: path.join(__dirname, 'src', 'js', 'background.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
          ],
        }),
        exclude: /node_modules/,
      },
      {
        test: new RegExp(`.(${fileExtensions.join('|')})$`),
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: 'build' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        transform: content =>
          Buffer.from(
            JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            })
          ),
      },
      {
        from: 'src/img',
        to: 'img',
      },
    ]),
    new WriteFilePlugin(),
    new ExtractTextPlugin('[name].css'),
  ],
};

if (process.env.NODE_ENV === 'development') {
  options.mode = 'development';
  options.devtool = 'cheap-module-source-map';
  options.plugins.push(
    new ChromeExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: 'content',
        background: 'background',
      },
    })
  );
} else if (process.env.NODE_ENV === 'production') {
  options.mode = 'production';
  options.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new TerserPlugin()
  );
}

module.exports = options;
