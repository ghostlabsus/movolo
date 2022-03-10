import Config from "@src/config.json";
import type { ScraperResult, SearchResult, VidEmbedResult } from "@src/Types";
import parse from "node-html-parser";
import CryptoJS from "crypto-js";

const BASE_URL = Config.scrapers.find(s => s.id === "gogo").url;

const search = async (query: string, type: "movie" | "tv"): Promise<SearchResult[]> => {
    const url = `${BASE_URL}/search.html?keyword=${query}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM = parse(unparsedHtml);

    const unmappedResults = [...DOM.querySelectorAll(".video-block")];
    const results = unmappedResults.map(result => {
        return {
            title: result.querySelector(".name").text.replace(/Episode [0-9]{1,}/, "").trim(),
            year: new Date(result.querySelector(".date").text).getFullYear() || new Date().getFullYear(),
            slug: encodeURIComponent(`${result.querySelector("a").attrs.href.slice(1).split("-episode-")[0]}-episode-1`),
            poster: result.querySelector("img").attrs.src,
            provider: "gogo",
            type
        }
    })

    return results;
};

const scrape = async (slug: string, type: "movie" | "tv"): Promise<ScraperResult> => {
    const url = `${BASE_URL}/${slug}`;
    const unparsedHtml = await fetch(url).then(res => res.text());
    const DOM = parse(unparsedHtml);

    // const unparsedHtmlIframe = await fetch(`https:${DOM.querySelector("iframe").attrs.src}`).then(res => res.text());
    // const DOMIframe = parse(unparsedHtmlIframe);

    // const encryptedValue = DOMIframe.querySelector("[data-name=crypto]").attrs["data-value"];
    // const time = DOMIframe.querySelector("[data-name=ts]").attrs["data-value"];
    const time = CryptoJS.enc.Utf8.parse("25716538522938396164662278833288"); // hardcoded time string? idfk
    const iv = CryptoJS.enc.Utf8.parse("1285672383939852"); // another hardcoded time string? idfk

    // const decryptedValue = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedValue, CryptoJS.enc.Utf8.parse(`${time}${time}`), {
    //     'iv': CryptoJS.enc.Utf8.parse(time)
    // }));

    const pathname = new URL(`https:${DOM.querySelector("iframe").attrs.src}`).searchParams.get("id");
    const id = CryptoJS.AES.encrypt(pathname, time, { iv }).toString();
    const { data } = await fetch(`${BASE_URL}/encrypt-ajax.php?id=${id}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0", "X-Requested-With": "XMLHttpRequest" } }).then(r => r.json());
    let json: VidEmbedResult = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(data, time, { iv })));

    const episodes = [...DOM.querySelector(".listing").querySelectorAll(".video-block")].map(e => {
        return {
            title: e.querySelector(".name").text.replace(/Episode [0-9]{1,}/, "").trim(),
            season: NaN,
            episode: parseInt(e.querySelector(".name").text.match(/Episode [0-9]{1,}/)[0].substr(8)),
            slug: encodeURIComponent(e.querySelector("a").attrs.href.slice(1)),
            provider: "gogo"
        }
    }).reverse();

    json.source = json.source.map(s => {
        const file = new URL(s.file);
        file.searchParams.set("vip", "");
        return {
            file: file.toString(),
            label: s.label,
            type: s.type
        }
    });

    return {
        url: json.source[json.source.length - 1].file,
        qualities: json.source.map(s => {
            return {
                quality: s.label.replace(" ", ""),
                url: s.file
            }
        }),
        episodes
    }
};

export default { search, scrape };