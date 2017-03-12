module.exports = {
  debug: true,
  devtool: 'inline-source-map',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015' ]
      }
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
  // ,
  //   headers: {
  //       "Access-Control-Allow-Origin": "https://api.zalando.com",
  //       "Access-Control-Allow-Credentials": "true",
  //       "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
  //       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  //   }
};

