import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
const HTMLParser = require("node-html-parser");
const CryptoJS = require("crypto-js");

const BASE_URL = Config.scrapers.find(s => s.id === "vembed").url;

const search = async (query: string, type: "movie" | "series"): Promise<SearchResult[]> => {
    const url = `${BASE_URL}/search.html?keyword=${query}`;
    const unparsedHtml = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0" }}).then(res => res.text());
    const DOM = HTMLParser.parse(unparsedHtml);

    const unmappedMovieResults = [...DOM.querySelectorAll(".video-block")].filter(result => !result.querySelector(".name").text.includes("Episode"));
    const movieResults = unmappedMovieResults.map(result => {
        return {
            title: result.querySelector(".name").text.split("HD-")[0].trim(),
            year: new Date(result.querySelector(".date").text).getFullYear() || new Date().getFullYear(),
            slug: encodeURIComponent(result.querySelector("a")._attrs.href.slice(1)),
            poster: result.querySelector("img")._attrs.src,
            provider: "vembed",
            type
        }
    });

    const unmappedTVResults = [...DOM.querySelectorAll(".video-block")].filter(result => result.querySelector(".name").text.includes("Episode"));
    const tvResults = unmappedTVResults.map(result => {
        return {
            title: result.querySelector(".name").text.split(" - Season")[0].trim(),
            year: new Date(result.querySelector(".date").text).getFullYear() || new Date().getFullYear(),
            slug: encodeURIComponent(result.querySelector("a")._attrs.href.slice(1)),
            poster: result.querySelector("img")._attrs.src,
            provider: "vembed",
            type
        }
    });

    if (type == "movie") {
        return movieResults;
    } else {
        return tvResults;
    };
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
    // request with X-Requested-With header set to XMLHttpRequest
    
    return;
};

export default { search, scrape };