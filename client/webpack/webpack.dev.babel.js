import webpack from 'webpack'
import merge from 'webpack-merge'
import common from './webpack.common.babel'


const DEV_PORT = 3000

export default merge(common, {
  entry: [
    'webpack-hot-middleware/client?reload=true&overlay=false',
    './src/index.js',
  ],
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './public',
    port: DEV_PORT,
  },
})
