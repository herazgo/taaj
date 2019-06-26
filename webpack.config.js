module.exports = function (env, argv) {
  const path = require('path')
  const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /(node_modules|bower_components|dist)/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ReplaceInFileWebpackPlugin([{
        dir: 'dist',
        files: ['index.js'],
        rules: [{
          search: /[a-z]+\.env\.REACT_APP(\w)/ig,
          replace: 'process.env.REACT_APP$1'
        }]
      }])
    ],
    performance: {
      hints: false
    },
    devtool: 'source-map',
    externals: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    mode: 'production'
    // mode: 'development'
  }
}
