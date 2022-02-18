import Config from "@src/config.json";
import parse from "node-html-parser";

const BASE_URL = Config.subtitles.find(s => s.id === "gdrive").url;

const getSubtitles = (tmdbId: string, language: string, season?: string, episode?: string) => {
    
};

export default { getSubtitles };