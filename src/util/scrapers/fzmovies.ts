import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
import parse from "node-html-parser";
const BASE_URL = Config.scrapers.find(s => s.id === "fzm").url;

const search = async (query: string, type: "movie" | "tv"): Promise<SearchResult[]> => {
    if (type === "tv") return [];
    const url = `${BASE_URL}/csearch.php`;
    const unparsedHtml = await fetch(url, {
        method: "POST",
        body: `searchname=${encodeURIComponent(query).replace(/\%20/g, "+")}&Search=Search&searchby=Name&category=All&vsearch=`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(res => res.text());
    const DOM = parse(unparsedHtml);

    const unmappedResults = [...DOM.querySelectorAll("td")].filter(td => td.attrs.style === "vertical-align:top;height=100px;display:inline-block");
    const results = unmappedResults.map((result, index) => {
        const parentNode = [...result.parentNode.querySelectorAll("td")].filter(td => td.attrs.style === "vertical-align:top;height=100px;")[index]
        return {
            title: result.querySelector("small").innerText,
            year: parseInt(result.querySelectorAll("small")[1].innerText.match(/\d{4}/)[0]),
            slug: parentNode.querySelector("a").attrs.href,
            poster: `${BASE_URL}${parentNode.querySelector("img").attrs.src}`,
            provider: "fzm",
            type
        }
    });

    return results;
};

const scrape = async (slug: string, type: "movie" | "tv"): Promise<ScraperResult>  => {
    
    return;
};

export default { search, scrape };