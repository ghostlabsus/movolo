import Config from "@src/config.json";
import type { ScraperResult, SearchResult } from "@src/Types";
import parse from "node-html-parser";
import CryptoJS from "crypto-js";

const BASE_URL = Config.scrapers.find(s => s.id === "gdrive").url;
const API_URL = Config.scrapers.find(s => s.id === "gdrive").api;

const format = {
    stringify: (cipher) => {
        const ct = cipher.ciphertext.toString(CryptoJS.enc.Base64);
        const iv = cipher.iv.toString() || "";
        const salt = cipher.salt.toString() || "";
        return JSON.stringify({
            ct,
            iv,
            salt,
        });
    },
    parse: (jsonStr) => {
        const json = JSON.parse(jsonStr);
        const ciphertext = CryptoJS.enc.Base64.parse(json.ct);
        const iv = CryptoJS.enc.Hex.parse(json.iv) || "";
        const salt = CryptoJS.enc.Hex.parse(json.s) || "";

        const cipher = CryptoJS.lib.CipherParams.create({
            ciphertext,
            iv,
            salt,
        });
        return cipher;
    }
};

const search = async (query: string, type: "movie" | "tv"): Promise<SearchResult[]> => {
    switch (type) {
        case "movie":
            const movieUrl = `${API_URL}/v1/movie/search?title=${query}`;
            const movieJSON = await fetch(movieUrl).then(res => res.json());

            const movieResults = movieJSON.map(result => {
                return {
                    title: result.title,
                    year: parseInt(result.year),
                    slug: `player.php?imdb=${result.imdb}`,
                    poster: result.poster,
                    provider: "gdrive",
                    type
                }
            });
            return movieResults;
        case "tv":
            const animesUrl = `${API_URL}/v1/animes/search?title=${query}`;
            const animesJSON = await fetch(animesUrl).then(res => res.json()) || [];
            const dramaUrl = `${API_URL}/v1/drama/search?title=${query}`;
            const dramaJSON = await fetch(dramaUrl).then(res => res.json()) || [];
            const seriesUrl = `${API_URL}/v1/series/search?title=${query}`;
            const seriesJSON = await fetch(seriesUrl).then(res => res.json()) || [];

            console.log(dramaJSON);

            const animesResults = animesJSON.map(result => {
                const player_url = new URL(result.player_url);
                return {
                    title: result.title,
                    year: parseInt(result.year),
                    slug: `${player_url.pathname}${player_url.search.replace(/{insert%201%20-%20\d{1,}}/, "1")}`,
                    poster: result.poster,
                    provider: "gdrive",
                    type
                }
            });
            const dramaResults = dramaJSON.map(result => {
                const player_url = new URL(result.player_url);
                return {
                    title: result.title,
                    year: parseInt(result.year),
                    slug: `${player_url.pathname}${player_url.search.replace(/{insert%201%20-%20\d{1,}}/, "1")}`,
                    poster: result.poster,
                    provider: "gdrive",
                    type
                }
            });
            const seriesResults = seriesJSON.map(result => {
                const player_url = new URL(result.player_url);
                return {
                    title: result.title,
                    year: parseInt(result.year),
                    slug: `${player_url.pathname}${player_url.search.replace(/{insert%201%20-%20\d{1,}}/, "1")}`,
                    poster: result.poster,
                    provider: "gdrive",
                    type
                }
            });

            return [...animesResults, ...dramaResults, ...seriesResults];
    }
    return;
};

const scrape = async (slug: string, type: "movie" | "tv"): Promise<ScraperResult>  => {
    
    return;
};

export default { search, scrape };