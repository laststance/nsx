const { join } = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const dotenv = require('dotenv')
const dotenvWebpack = require('dotenv-webpack')
const GenerateJsonFromJsPlugin = require('generate-json-from-js-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin, optimize } = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const prodPlugins = [],
  isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  prodPlugins.push(new optimize.AggressiveMergingPlugin())
}

const Root = join(__dirname, '..')
const Source = join(Root, 'src')
const Dist = join(Root, 'dist')

const Assets = join(Source, 'assets')
const Background = join(Source, 'background')
const Content = join(Source, 'content')
const Popup = join(Source, 'popup')
const Lib = join(Source, 'lib')
// const Option = join(Source, 'option')

const config = {
  devtool: isProd ? 'source-map' : 'cheap-source-map',
  entry: {
    background: join(Background, 'index.ts'),
    content: join(Content, 'index.js'),
    // option: join(Option, 'index.tsx'),
    popup: join(Popup, 'index.tsx'),
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
      },
      {
        exclude: /(node_modules)/,
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                // { "pragma":"h" }
              ],
            ],
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
        test: /\.(gql)$/,
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.pcss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, '../', 'dist'),
  },
  plugins: [
    new dotenvWebpack(),
    new DefinePlugin({
      'process.env': JSON.stringify(
        dotenv.config({
          path: join(
            Root,
            `.env.${process.env.TARGET_ENV || process.env.NODE_ENV}`,
          ),
        }).parsed,
      ),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: join(Assets, 'html'),
          to: 'assets/html',
        },
        {
          from: join(Assets, 'images'),
          to: 'assets/images',
        },
        {
          from: join(Assets, 'json'),
          to: 'assets/json',
        },
      ],
    }),
    ...(process.env.STATS ? [new BundleAnalyzerPlugin()] : []),
    ...prodPlugins,
  ],
  resolve: {
    alias: {
      assets: Assets,
      background: Background,
      // content: Content,
      lib: Lib,
      // option: Option,
      popup: Popup,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.png', '.svg', '.gql'],
  },
  target: 'web',
}

const buildConfig = (browser, path) => ({
  ...config,
  name: browser,
  output: {
    filename: '[name].js',
    path: join(Dist, path || browser),
  },
  plugins: [
    ...config.plugins,
    new GenerateJsonFromJsPlugin({
      filename: 'manifest.json',
      path: join(Source, 'manifest', `${browser}.js`),
    }),
  ],
})

module.exports = {
  buildConfig,
  config,
}
