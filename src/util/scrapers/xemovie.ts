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
            slug: encodeURIComponent(new URL(result.querySelector("a").attrs.href).pathname.slice(1)),
            poster: result.querySelector("img").attrs["data-src"],
            provider: "xem",
            type
        }
    }), { keys: ["title"], threshold: 0.3 }).search(query).map(r => r.item);

    const unmappedTvResults = [...DOM.querySelectorAll('.py-10')[1].querySelector(".grid").querySelectorAll("div")].filter(el => el.childNodes.length == 9);
    const tvResults = new Fuse(unmappedTvResults.map(result => {
        return {
            title: result.querySelector(".block").text.replace(/ \([0-9]{4}\)/g, "").split(" Season")[0].trim(),
            year: parseInt(result.querySelector(".float-right").text),
            slug: encodeURIComponent(new URL(result.querySelector("a").attrs.href).pathname.slice(1)),
            poster: result.querySelector("img").attrs["data-src"],
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
    if (type === "movie") {
        const url = `${BASE_URL}/${slug}/watch`;
        const unparsedHtml = await fetch(url).then(res => res.text());
        const DOM = parse(unparsedHtml);

        const script = [...DOM.querySelectorAll("script")].find(script => script.textContent.includes("const data ="));
        const data = JSON.parse(JSON.stringify(eval(`(${script.textContent.replace("const data = ", "").split("};")[0]}})`)));

        return {
            url: data.playlist[0].file,
            subtitles: data.playlist[0].tracks.map((track: { label: string; file: string; kind: string; default: boolean; }) => {
                return {
                    lang: track.label,
                    url: track.file,
                    type: track.kind,
                    default: track.default
                }
            })
        }
    } else {
        const url = `${BASE_URL}/${slug}`;
        const unparsedHtml = await fetch(url).then(res => res.text());
        const DOM = parse(unparsedHtml);

        const urlEpisodes = `${BASE_URL}/${slug.split("-episode")[0] || slug}`
        const unparsedEpisodeHtml = await fetch(urlEpisodes).then(res => res.text());
        const DOMEpisode = parse(unparsedEpisodeHtml);

        const unmappedEpisodes = [...DOMEpisode.querySelector(".grid.grid-cols-3.gap-3").querySelectorAll("a")];
        const episodes = unmappedEpisodes.map(episode => {
            return {
                title: episode.innerText.split(" Episode")[0].trim(),
                season: episode.innerText.split("Season ").length != 1 ? parseInt(episode.innerText.split("Season ")[1].split(" ")[0].trim()) : 1,
                episode: parseInt(episode.innerText.split(" Episode")[1].trim()),
                slug: encodeURIComponent(new URL(episode.attrs.href).pathname.slice(1)),
                provider: "xem",
            }
        });

        if (!slug.endsWith("watch")) {
            const firstEpisode = episodes.find(episode => episode.episode === 1);
            const unparsedHtmlEpisode = await fetch(`${BASE_URL}/${firstEpisode.slug}`).then(res => res.text());
            const DOMEpisode = parse(unparsedHtmlEpisode);
            const script = [...DOMEpisode.querySelectorAll("script")].find(script => script.textContent.includes("const data ="));
            const data = JSON.parse(JSON.stringify(eval(`(${script.textContent.replace("const data = ", "").split("};")[0]}})`)));

            return {
                url: data.playlist[0].file,
                subtitles: data.playlist[0].tracks.map((track: { label: string; file: string; kind: string; default: boolean; }) => {
                    return {
                        lang: track.label,
                        url: track.file,
                        type: track.kind,
                        default: track.default
                    }
                }),
                episodes
            };
        } else {
            const script = [...DOM.querySelectorAll("script")].find(script => script.textContent.includes("const data ="));
            const data = JSON.parse(JSON.stringify(eval(`(${script.textContent.replace("const data = ", "").split("};")[0]}})`)));

            return {
                url: data.playlist[0].file,
                subtitles: data.playlist[0].tracks.map((track: { label: string; file: string; kind: string; default: boolean; }) => {
                    return {
                        lang: track.label,
                        url: track.file,
                        type: track.kind,
                        default: track.default
                    }
                }),
                episodes
            }
        }
    }
};

export default { search, scrape };