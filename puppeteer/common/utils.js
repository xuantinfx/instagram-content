const fs = require('fs').promises;

exports.loadCookies = async (fileUrl, page)=>{
    try {
        console.log('------------Load cookies------------');
        const cookiesString = await fs.readFile(fileUrl);
        const cookie = JSON.parse(cookiesString);
        await page.setCookie(...cookie);
    }catch (e) {
        console.log(e);
        throw e;
    }

};

exports.saveCookies = async (fileUrl, page)=>{
    try {
        console.log('------------Save cookies------------');
        const cookies = await page.cookies();
        await fs.writeFile(fileUrl, JSON.stringify(cookies, null, 2));
    }catch (e) {
        console.log(e);
        throw e;
    }
};
