const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

let parser = new Parser();

async function scrapFunction() {
        
    for (let i = 0; i < 249; i++) {
        const request_link = `https://buildout.com/plugins/9a64a93980aeae8db347e72cdfa8ca61017acc9a/inventory?lat_min=&lat_max=&lng_min=&lng_max=&page=${i}&light_view=true&placesAutoComplete=&q%5Btype_use_offset_eq_any%5D%5B%5D=&q%5Bsale_or_lease_eq%5D=&q%5Bproperty_use_id_eq_any%5D%5B%5D=&q%5Bwith_space_type_ids%5D%5B%5D=&q%5Bbuilding_size_sf_gteq%5D=&q%5Bbuilding_size_sf_lteq%5D=&q%5Blot_size_acres_gteq%5D=&q%5Blot_size_acres_lteq%5D=&q%5Bproperty_research_property_year_built_gteq%5D=&q%5Bproperty_research_property_year_built_lteq%5D=&q%5Blistings_data_max_space_available_on_market_gteq%5D=&q%5Blistings_data_min_space_available_on_market_lteq%5D=&q%5Bsale_price_gteq%5D=&q%5Bsale_price_lteq%5D=&q%5Bcap_rate_pct_gteq%5D=&q%5Bcap_rate_pct_lteq%5D=&q%5Bmax_lease_rate_gteq%5D=&q%5Bmin_lease_rate_lteq%5D=&q%5Bmax_lease_rate_monthly_gteq%5D=&q%5Bmin_lease_rate_monthly_lteq%5D=&q%5Bproperty_research_property_number_of_units_gteq%5D=&q%5Bproperty_research_property_number_of_units_lteq%5D=&q%5Bstate_eq_any%5D%5B%5D=&q%5Bs%5D%5B%5D=`;
        await fetch(request_link, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9,ko;q=0.8",
                "if-none-match": "W/\"6dc5cbfc9e014c6cbe4741af65e69707\"",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-newrelic-id": "Vg4GU1RRGwIJUVJUAwY=",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.1.234793834.1709742396; _cookie_preferences=%7B%22analytics%22%3Atrue%7D; _gid=GA1.1.2043896534.1709997154; _ga_YPL38J0CY7=GS1.1.1709997145.6.1.1709997481.0.0.0",
                "Referer": "https://buildout.com/plugins/9a64a93980aeae8db347e72cdfa8ca61017acc9a/www.lee-associates.com/inventory/?pluginId=0&iframe=true&embedded=true&inventoryParentUrl=https%3A%2F%2Fwww.lee-associates.com%2Fproperties%2F&cacheSearch=true&=undefined",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        })
        .then(response => {
            if (response.ok) {
                console.log("response okay!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                return response.json(); // assuming the response is in JSON format
            } else {
                throw new Error("Request failed with status " + response.status);
            }
        })
        .then(data => {
            result_data = data.inventory;
            for (let i = 0; i < result_data.length; i++) {
                const link = result_data[i].show_link;
                console.log(link);
                const result = { link };
                const csv = parser.parse(result);
                const csvDataWithoutHeader = csv.split('\n')[1] + '\n';
                fs.appendFileSync("avisonyoung_link.csv", csvDataWithoutHeader, 'utf8', (err) => {
                    if (err) {
                        console.error('Error appending to CSV file:', err);
                    } else {
                        console.log('CSV data appended successfully.');
                    }
                });
                
            }
        })
        .catch(error => {
            console.error("No match result ...");
        });
    }
}

scrapFunction();