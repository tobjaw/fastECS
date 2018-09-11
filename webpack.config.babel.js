import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const common = {
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
}

const dev = {
  entry: './src/demo/index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/demo/index.ejs',
      inject: 'body',
    }),
  ],
}
const prod = {}

const config = (env, argv) =>
  merge(common, argv.mode === 'development' ? dev : prod)

export default config
