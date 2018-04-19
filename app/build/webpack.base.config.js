const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              "env",
              {
                "targets": {
                  "browsers": ["last 2 versions"]
                }
              }
            ],
          ],
          plugins: [
            "syntax-dynamic-import",
          ],
        },
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: 'css-loader?minimize',
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader'
      },
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new UglifyJsPlugin({
          
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        }),
        // new BundleAnalyzerPlugin(),
      ]
    : [
        new FriendlyErrorsPlugin(),
        // new BundleAnalyzerPlugin(),
      ]
}
