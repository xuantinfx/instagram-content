const urls = require('./result.json');
const { download } = require('./utils/downloader');

const main = async () => {
  console.log(urls);
  for (let i = 0; i < urls.length; i++) {
    console.log('Downloading', urls[i]);
    await download(urls[i], __dirname + `/result/${new Date().getTime()}_${Math.random()}`);
  }
};

main();
