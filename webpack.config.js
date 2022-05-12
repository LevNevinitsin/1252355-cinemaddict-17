const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    alias: {
      presenter: path.resolve(__dirname, 'src/presenter'),
      view: path.resolve(__dirname, 'src/view'),
      popup: path.resolve(__dirname, 'src/view/popup'),
      utils: path.resolve(__dirname, 'src/utils.js'),
      model: path.resolve(__dirname, 'src/model'),
      framework: path.resolve(__dirname, 'src/framework'),
      frameworkView: path.resolve(__dirname, 'src/framework/view'),
      mock: path.resolve(__dirname, 'src/mock'),
    }
  }
};
