import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
import parse from "node-html-parser";
import Fuse from "fuse.js";

const BASE_URL = Config.scrapers.find(s => s.id === "xem").url;

const search = async (query: string, type: "movie" | "tv"): Promise<SearchResult[]> => {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query).replace(/%20/g, "+")}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM: any = parse(unparsedHtml);

    const unmappedMovieResults = [...DOM.querySelector('.py-10').querySelector(".grid").querySelectorAll("div")].filter(el => el.childNodes.length == 9);
    let movieResults = new Fuse(unmappedMovieResults.map(result => {
        return {
            title: result.querySelector(".block").text.replace(/ \([0-9]{4}\)/g, "").trim(),
            year: parseInt(result.querySelector(".float-right").text),
            slug: encodeURIComponent(new URL(result.querySelector("a").rawAttrs.replace('href="', "").replace('"', "")).pathname.slice(1)),
            poster: result.querySelector("img")._attrs["data-src"],
            provider: "xem",
            type
        }
    }), { keys: ["title"], threshold: 0.3 }).search(query).map(r => r.item);

    const unmappedTvResults = [...DOM.querySelectorAll('.py-10')[1].querySelector(".grid").querySelectorAll("div")].filter(el => el.childNodes.length == 9);
    const tvResults = new Fuse(unmappedTvResults.map(result => {
        return {
            title: result.querySelector(".block").text.replace(/ \([0-9]{4}\)/g, "").split(" Season")[0].trim(),
            year: parseInt(result.querySelector(".float-right").text),
            slug: encodeURIComponent(new URL(result.querySelector("a").rawAttrs.replace('href="', "").replace('"', "")).pathname.slice(1)),
            poster: result.querySelector("img")._attrs["data-src"],
            provider: "xem",
            type
        }
    }), { keys: ["title"], threshold: 0.3 }).search(query).map(r => r.item);

    if (type === "movie") {
        return movieResults
    } else {
        return tvResults;
    }
};

const scrape = async (slug: string, type: "movie" | "tv"): Promise<ScraperResult> => {

    return;
};

export default { search, scrape };