import Config from "@src/config.json";
const HTMLParser = require("node-html-parser");

const BASE_URL = Config.subtitles.find(s => s.id === "gdp").url;

const getSubtitles = (tmdbId: string, language: string, season?: string, episode?: string) => {
    
};

export default { getSubtitles };