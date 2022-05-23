const HtmlWebpackPlugin = require('html-webpack-plugin');
const {TsconfigPathsPlugin} = require("tsconfig-paths-webpack-plugin");
const path = require('path');

module.exports = function build(env, arg) {
  const config = {
    entry: {
      event: ['./src/event.ts'],
      index: {
        dependOn: 'event',
        import: './src/main.ts'
      },
      interface: {
        dependOn: 'event',
        import: './src/interface/index.tsx'
      }
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename:'[name].js',
      chunkFilename: 'chunks/[contenthash].js',
      publicPath: '',
    },
    devServer: {
      static: path.join(__dirname, 'build'),
      compress: true,
      port: 8888
    },
    /*
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },*/
    mode: arg.mode,
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
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
          test: /\.(css)$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
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
      extensions: ['.ts', '.js','.tsx'],
      plugins: [
        new TsconfigPathsPlugin()
      ]
    },
  };

  return config;
};
