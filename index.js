const { loadCookies, saveCookies } = require("./puppeteer/common/utils");
const puppeteer = require("puppeteer");
const fs = require('fs');

const cookiesPath = __dirname + "/cookies.json";

const main = async (keyWord) => {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox"
      // '--disable-web-security',
      // '--disable-features=UserAgentClientHint'
    ],
    headless: false
  });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  await page.setViewport({
    width: 1455,
    height: 1080
  });
  await page.setRequestInterception(true);
  page.on("request", request => {
    // Do nothing in case of non-navigation requests.
    if (!request.isNavigationRequest()) {
      request.continue();
      return;
    }
    // Add a new header for navigation request.
    const headers = request.headers();
    headers["user-agent"] =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";
    request.continue({ headers });
  });
  await loadCookies(cookiesPath, page);

  await page.goto("https://www.instagram.com/explore/", {
    waitUntil: "networkidle2"
  });
  await page.waitForTimeout(2000);

  await page.waitForTimeout(1000);

  for (let i = 0; i < keyWord.length; i++) {
    await page.type('._9_uj._a4th._a4tk', keyWord[i]);
    await page.waitForTimeout(100);
  }

  await page.waitForTimeout(5000);

  const searchResult = await page.$$eval('div[role="none"] a', elements => elements.map(el => el.href));
  const urlWillCrawl = searchResult.filter(url => /https:\/\/www.instagram.com\/.[^/]+\//.test(url));

  let result = [];

  for (let i = 0; i < urlWillCrawl.length && i < 3; i++) {
    await page.goto(urlWillCrawl[i], {
      waitUntil: "networkidle2"
    });
    await page.waitForTimeout(5000);
    for (let i = 0; i < 2; i++) {
      await page.evaluate(_ => {
        window.scrollBy(0, window.innerHeight * 4);
      });
      await page.waitForTimeout(2000);
    }
    const curResult = await page.$$eval('a[role="link"] img', elements => elements.map(el => el.src));
    result = result.concat(curResult);
  }

  await browser.close();

  return result
};

main('girl').then(res => {
  fs.writeFileSync(__dirname + "/result.json", JSON.stringify(res, null, 2));
  console.log('res', res)
}).catch(e => {
  console.log(e);
});
