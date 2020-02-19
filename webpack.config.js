const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let entry = __dirname + '/app/src/js/app.js';
let outputPath = path.resolve(__dirname, 'public');
let devtool = '';

if (process.env.TESTBUILD) {
  entry = glob.sync(__dirname + '/app/test/**/*.test.js');
  outputPath = path.resolve(__dirname, 'test-dist');
  devtool = 'source-map';
}

module.exports = {
  entry: entry,
  output: {
    path: outputPath,
    filename: '[name].[hash].js'
  },
  devtool: devtool,
  devServer: {
    contentBase: './public',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CopyPlugin([
      { from: 'images/**/*.*', to: './', force: true },
      { from: 'favicon.ico', to: './', force: true },
      { from: 'src', to: './', force: true },
    ],
    {
      copyUnmodified: true
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['public'] }
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[hash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './app/src/index.html',
      filename: 'index.html'
    }),
    new WebpackMd5Hash(),
    new CleanWebpackPlugin(),
  ]
}
