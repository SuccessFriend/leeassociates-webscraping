const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');
const http = require('http');

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

    const data = await readFileSequentially("leeassociates_pdf.csv");
    for (const row of data) {
        console.log("--------- ", count, " -----------");
        count ++;

        const url = row[0];

        // Step 1: Navigate to the page
        await page.goto(url);
    
        // Step 2: Wait for the <embed> tag to load
        await page.waitForSelector('embed');
    
        // Step 3: Extract the URL of the embedded PDF
        const pdfUrl = await page.evaluate(() => {
            return document.querySelector('embed').src;
        });

        console.log("embed url >>> ", pdfUrl);
    
        // Step 4: Download the PDF file
        const pdfPath = "./download/" + url.split("?")[0].split("/")[5];
        console.log("file name >>> ", pdfPath);
        const file = fs.createWriteStream(pdfPath);
        https.get(pdfUrl, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Download completed.');
            });
        });
    
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

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   const pdfUrls = [
//     "https://buildout.com/docs/documents/3118168?token=e7d839cf9b7ce25adb426216f35d23c0f469effc",
//     "https://buildout.com/docs/documents/3119855?token=22fa383ff683340a87b43b3e8fd22e7e1dd2bcc9",
//     "https://buildout.com/docs/documents/3197394?token=8715c92181128bb14360f4d0fd16aba2ff2570e7",
//     "https://buildout.com/docs/documents/3212484?token=98785e21403059e5d4e1cf1a3b193f73f067a109",
//     "https://buildout.com/docs/documents/3159267?token=36e1bc333aff750ae854b4d3e2b33163944af922",
//     "https://buildout.com/docs/documents/3106050?token=cfe8435c2f9ae5df9b10044f6e31d91ccdcf0fdb"
//   ];

//   for (const url of pdfUrls) {
//     const response = await page.goto(url, { waitUntil: 'networkidle2' });
//     const buffer = await response.buffer();
//     const filename = path.basename(url);
//     fs.writeFileSync(`./downloads/${filename}.pdf`, buffer);
//     console.log(`Downloaded ${filename}.pdf`);
//   }

//   await browser.close();
// })();

// //////////////////////////////////////////////////////////////////

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const https = require('https');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Step 1: Navigate to the page
//     await page.goto('http://example.com/your-page');

//     // Step 2: Wait for the <embed> tag to load
//     await page.waitForSelector('embed');

//     // Step 3: Extract the URL of the embedded PDF
//     const pdfUrl = await page.evaluate(() => {
//         return document.querySelector('embed').src;
//     });

//     // Step 4: Download the PDF file
//     const pdfPath = 'path/to/save/the/pdf/file.pdf';
//     const file = fs.createWriteStream(pdfPath);
//     https.get(pdfUrl, response => {
//         response.pipe(file);
//         file.on('finish', () => {
//             file.close();
//             console.log('Download completed.');
//         });
//     });

//     await browser.close();
// })();
////////////////////////////////////////////////////////////////////


