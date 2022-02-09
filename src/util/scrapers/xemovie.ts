import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const HTMLParser = require("node-html-parser");
const Fuse = require("fuse.js");

const BASE_URL = Config.scrapers.find(s => s.id === "xem").url;

const search = async (query: string, type: "movie" | "series"): Promise<SearchResult[]> => {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query).replace(/%20/g, "+")}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM: any = HTMLParser.parse(unparsedHtml);

    const unmappedMovieResults = [...DOM.querySelector('.py-10').querySelector(".grid").querySelectorAll("div")].filter(el => el.childNodes.length == 9);
    let movieResults = new Fuse(unmappedMovieResults.map(result => {
        return {
            title: result.querySelector(".block").text.replace(/ \([0-9]{4}\)/g, "").trim(),
            year: parseInt(result.querySelector(".float-right").text),
            slug: new URL(result.querySelector("a").rawAttrs.replace('href="', "").replace('"', "")).pathname.slice(1),
            poster: result.querySelector("img").src,
            provider: "xem",
            type
        }
    }), { keys: ["title"] }).search(query).map(r => r.item);

    const unmappedTvResults = [...DOM.querySelectorAll('.py-10')[1].querySelector(".grid").querySelectorAll("div")].filter(el => el.childNodes.length == 9);
    const tvResults = new Fuse(unmappedTvResults.map(result => {
        return {
            title: result.querySelector(".block").text.replace(/ \([0-9]{4}\)/g, "").trim(),
            year: parseInt(result.querySelector(".float-right").text),
            slug: new URL(result.querySelector("a").rawAttrs.replace('href="', "").replace('"', "")).pathname.slice(1),
            poster: result.querySelector("img").src,
            provider: "xem",
            type
        }
    }), { keys: ["title"] }).search(query).map(r => r.item);

    if (type === "movie") {
        return movieResults
    } else {
        return tvResults;
    }
};

const scrape = async (slug: string, type: "movie" | "series"): Promise<ScraperResult>  => {

    return;
};

export default { search, scrape };