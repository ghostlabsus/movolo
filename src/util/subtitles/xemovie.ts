import Info from "@src/info.json";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const BASE_URL = Info.subtitles.find(s => s.id === "xem").url;

const getSubtitles = (tmdbId: string, language: string, season?: string, episode?: string) => {
    
};

export default { getSubtitles };