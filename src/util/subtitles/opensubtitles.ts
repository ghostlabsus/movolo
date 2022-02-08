import Info from "info.json";
import fetch from "node-fetch";

const BASE_URL = Info.subtitles.find(s => s.id === "os").url;

const getSubtitles = (tmdbId: string, language: string, season?: string, episode?: string) => {
    
};

export default { getSubtitles };