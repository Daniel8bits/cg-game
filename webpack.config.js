const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = function build(env, arg) {
  const config = {
    entry: {
      index: ['./src/main.ts'],
    },
    output: {
      path: path.join(__dirname, 'build'),
      chunkFilename: 'chunks/[id].js',
      publicPath: '',
    },
    devServer: {
      static: path.join(__dirname, 'build'),
      compress: true,
      port: 8888
    },
    mode: arg.mode,
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(ts|js)$/i,
          exclude: /node_modules/i,
          loader: 'babel-loader',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(obj|fbx)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(glsl)$/i,
          loader: 'webpack-glsl-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, '/src'),
        path.resolve(__dirname, 'node_modules/'),
      ],
      extensions: ['.ts', '.js'],
    },
  };

  return config;
};
