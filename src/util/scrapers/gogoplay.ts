import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const HTMLParser = require("node-html-parser");
const CryptoJS = require("crypto-js");

const BASE_URL = Config.scrapers.find(s => s.id === "gogo").url;

const search = async (query: string, type: "movie" | "series"): Promise<SearchResult[]> => {

    return;
};

const scrape = async (slug: string, type: "movie" | "series"): Promise<ScraperResult> => {
    const url = `${BASE_URL}/${slug}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM = HTMLParser.parse(unparsedHtml);

    // CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(crypto data value, CryptoJS.enc.Utf8.parse(time as a string twice), {
    //     'iv': CryptoJS.enc.Utf8.parse(time as a string)
    //   }))
    // CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(document.querySelector("[name=crypto]").content, CryptoJS.enc.Utf8.parse(value from above), {
    //     'iv': CryptoJS.enc.Utf8.parse(time as a string)
    //   }))
    // CryptoJS.enc.Utf8.stringify(value from above) // MTExODQ3&title=Hunter+x+Hunter+2011+%28Dub%29+Episode+1&mip=0.0.0.0&refer=none&ch=d41d8cd98f00b204e9800998ecf8427e
    // value from above.substr(0, 8)
    // generate random 16 digit string
    // CryptoJS.AES.encrypt(substr value, CryptoJS.enc.Utf8.parse(1st value), { iv: CryptoJS.enc.Utf8.parse(the random value) }).toString()
    // fetch("https://gogoplay1.com/encrypt-ajax.php?id=value from above&title=get from url params&mip=&refer=&ch=&time=2 random digits + random 16 digit string + 2 random digits")
    
    return;
};

export default { search, scrape };