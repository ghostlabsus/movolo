import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
import Fuse from "fuse.js";
import parse from "node-html-parser";

const BASE_URL = Config.scrapers.find(s => s.id === "vidz").url;

const search = async (query: string, type: "movie" | "tv"): Promise<SearchResult[]> => {
    if (type === "tv") return [];

    const url = `${BASE_URL}/search.php?sd=${query.replace(/ /g, "_")}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM = parse(unparsedHtml);

    const unmappedResults = [...DOM.querySelectorAll(".post")];
    const results = new Fuse(unmappedResults.map(result => {
        const titleArray = result.querySelector(".title").innerText.replace(/\n/g, "").trim().split(" ").join("-").split("-");
        titleArray.splice(-2);
        return {
            title: titleArray.join(" ").trim(),
            year: new Date(result.querySelector(".post-meta").querySelector("span").innerText).getFullYear(),
            slug: encodeURIComponent(result.querySelector("a").attrs.href),
            provider: "vidz",
            type
        }
    }), { keys: ["title"], threshold: 0.3 }).search(query).map(r => r.item);

    return results;
};

const scrape = async (slug: string, type: "movie"): Promise<ScraperResult>  => {
    const url = `${BASE_URL}/${slug}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM = parse(unparsedHtml);

    return {
        url: DOM.querySelector("source").attrs.src
    };
};

export default { search, scrape };