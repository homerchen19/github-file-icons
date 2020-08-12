const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    content: path.join(__dirname, 'src', 'ts', 'content.ts'),
    background: path.join(__dirname, 'src', 'ts', 'background.ts'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /node_modules/,
      },
      {
        test: new RegExp(`.(${fileExtensions.join('|')})$`),
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          transform: (content) =>
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
      ],
    }),
    new WriteFilePlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
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
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: 'build' }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new TerserPlugin()
  );
}

module.exports = options;
