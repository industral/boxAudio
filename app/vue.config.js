const fs = require('fs');

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync(`${__dirname}/certs/server.key`),
      cert: fs.readFileSync(`${__dirname}/certs/server.crt`),
      ca: fs.readFileSync(`${__dirname}/certs/rootCA.pem`),
    }
  }
};
