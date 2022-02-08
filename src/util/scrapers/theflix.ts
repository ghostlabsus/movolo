import Config from "@src/config.json";
const HTMLParser = require("node-html-parser");
import type { ScraperResult, SearchResult } from "@src/Types";

const BASE_URL = Config.scrapers.find(s => s.id === "tf").url;

const search = async (query: string, type: "movie" | "series"): Promise<SearchResult[]> => {
    const searchType = (type === "movie") ? "movies" : "tv-shows";
    const url = `${BASE_URL}/${searchType}/trending?search=${encodeURIComponent(query)}`
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM = HTMLParser.parse(unparsedHtml);

    const unmappedResults = JSON.parse(DOM.querySelector("#__NEXT_DATA__").innerHTML).props.pageProps.mainList.docs.filter(result => result.available);
    const results = unmappedResults.map(result => {
        return {
            title: result.name,
            year: new Date(result.releaseDate).getFullYear(),
            slug: `${type == "movie" ? type : "tv-show"}/${result.id}-${result.name.toLowerCase().replace(/ /g, "-").replace(/[^A-Za-z0-9-]/g, "")}`,
            poster: result.posterUrl,
            provider: "tf",
            type
        }
    });

    return results;
};

const scrape = async (slug: string): Promise<ScraperResult> => {

    return;
};

export default { search, scrape };