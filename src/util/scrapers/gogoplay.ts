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
            slug: encodeURIComponent(result.querySelector("a")["_attrs"].href.slice(1)),
            poster: result.querySelector("img")["_attrs"].src,
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

    const unparsedHtmlIframe = await fetch(`https:${DOM.querySelector("iframe").rawAttrs.split('src="')[1].split('"')[0]}`).then(res => res.text());
    const DOMIframe = parse(unparsedHtmlIframe);

    const encryptedContent = DOMIframe.querySelector("[name=crypto]")["_attrs"].content;
    const encryptedValue = DOMIframe.querySelector("[data-name=crypto]")["_attrs"]["data-value"];
    const time = DOMIframe.querySelector("[data-name=ts]")["_attrs"]["data-value"];

    const decryptedValue = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedValue, CryptoJS.enc.Utf8.parse(`${time}${time}`), {
        'iv': CryptoJS.enc.Utf8.parse(time)
    }));

    const decryptedContent = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedContent, CryptoJS.enc.Utf8.parse(`${decryptedValue}`), {
        'iv': CryptoJS.enc.Utf8.parse(time)
    }));

    const pathname = decryptedContent.substr(0, decryptedContent.indexOf('&'));
    const id = CryptoJS.AES.encrypt(pathname, CryptoJS.enc.Utf8.parse(decryptedValue), { iv: CryptoJS.enc.Utf8.parse("0000000000000000") }).toString();
    let json: VidEmbedResult = await fetch(`https://gogoplay.io/encrypt-ajax.php?id=${id}&time=00000000000000000000`, { headers: { "X-Requested-With": "XMLHttpRequest" } }).then(r => r.json());

    const episodes = [...DOM.querySelector(".listing").querySelectorAll(".video-block")].map(e => {
        return {
            title: e.querySelector(".name").text.replace(/Episode [0-9]{1,}/, "").trim(),
            season: NaN,
            episode: parseInt(e.querySelector(".name").text.match(/Episode [0-9]{1,}/)[0].substr(8)),
            slug: encodeURIComponent(e.querySelector("a")["_attrs"].href.slice(1)),
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