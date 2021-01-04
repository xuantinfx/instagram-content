const fs = require('fs');
const request = require('request');
const get = require('lodash.get');

const download = (uri, filename) => {
  return new Promise(((resolve, reject) => {
    request.head(uri, function(err, res, body){
      if (err) {
        reject(err);
        return;
      }
      const contentType = `${res.headers['content-type']}`;
      const defaultExt = get(contentType.split('/'), '1');

      const fileNameWithEtx = `${filename}.${defaultExt}`;
      try {
        const requestInstance = request(uri).pipe(fs.createWriteStream(fileNameWithEtx));
        requestInstance.on('close', () => {
          resolve(fileNameWithEtx);
        });
      } catch (e) {
        reject(e);
      }
    });
  }));
};

module.exports = {
  download,
};
