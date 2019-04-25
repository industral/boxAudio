const fs = require('fs');
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css', 'woff2', 'json', 'html'];

module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/sw.js',
      importWorkboxFrom: 'disabled'
    }
  },

  chainWebpack: (config) => {
    config.plugins.delete('prefetch');

    if (config.plugins.has('optimize-css')) {
      config.plugins.delete('optimize-css')
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.productionSourceMap = false;
  module.exports.configureWebpack = {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        //TODO: switch to Brotli once it will be available on LTS Node.js
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        minRatio: 1,
        deleteOriginalAssets: true
      })
    ]
  };
} else {
  module.exports.devServer = {
    // host: 'localhost',
    https: {
      key: fs.readFileSync(`${__dirname}/server/certs/server.key`),
      cert: fs.readFileSync(`${__dirname}/server/certs/server.crt`),
      ca: fs.readFileSync(`${__dirname}/server/certs/rootCA.pem`),
    },

    before: (app) => {
      app.get('/sw.js', (req, res) => {
        res.type('application/javascript');
        res.send(fs.readFileSync(path.resolve(__dirname, './src/sw.js')));
      });
    }
  }
}
