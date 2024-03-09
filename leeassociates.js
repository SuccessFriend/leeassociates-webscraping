const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');

// Delay function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let count = 1;

async function scrapFunction() {

    const browser = await puppeteer.launch({
        headless: false,
        // args: ['--incognito'],
        args: ['--incognito', '--start-maximized'],
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    const data = await readFileSequentially("avisonyoung_link.csv");
    for (const row of data) {
        console.log("--------- ", count, " -----------");
        count ++;
        const link = row[0];
        console.log(link);

        await page.goto(link, {
            timeout: 300000
        });

        await delay(1000);

        let target_link = "";
        try {
            const iframeLink = await page.evaluate(() => {
                const iframe_ele = document.querySelector('div#buildout iframe');
                const targetLink = iframe_ele.getAttribute('src');
                return targetLink;
            })
            await page.goto(iframeLink);
            await delay(2000);

            target_link = await page.evaluate(() => {
                try {
                    const iframe_ele = document.querySelector('div.lead > a');
                    const targetLink = iframe_ele.getAttribute('href');
                    return targetLink;
                } catch (error) {
                    
                }
                try {
                    const iframe_ele = document.querySelector('#top-nav > div > div > a');
                    const targetLink = iframe_ele.getAttribute('href');
                    return targetLink;
                } catch (error) {
                }
            })
                
            console.log("target link >>> ", target_link);

            if (target_link) {
                console.log("Offering page...");
                console.log(target_link);
                await page.goto(target_link, { timeout: 300000 });
                await delay(3000);

                let download_link = "";
                try {
                    download_link = await page.evaluate(() => {
                        const down_btn = document.querySelector("#main_content > div > div > div > div > div > div > a");
                        const down_link = down_btn.getAttribute('href');
                        if (down_link != null) {
                            return down_link;
                        }
                    });
                } catch (error) {
                    
                }
                if (download_link && !download_link.includes("http")) {
                    console.log("download >>> ", download_link);
                    download_link = "https://buildout.com" + download_link;
                    await page.goto(download_link, { timeout: 300000 });
                    await delay(6000);
                }
                
            } else {
                continue;
            }
            
        } catch (error) {
            
        }
    
    }
        
    await browser.close();
    
}

async function readFileSequentially(filePath) {
    return new Promise((resolve, reject) => {
        let data = [];

        fs.createReadStream(filePath, { encoding: 'utf8' })
            .pipe(csv({ separator: ',', headers: false }))
            .on('data', chunk => {
                // console.log('data-->', chunk)
                data.push(chunk);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', error => {
                reject(error);
            });
    });
}

scrapFunction();