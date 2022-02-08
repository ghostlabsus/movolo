import Config from "@src/config.json";

const BASE_URL = Config.subtitles.find(s => s.id === "os").url;

const getSubtitles = (tmdbId: string, language: string, season?: string, episode?: string) => {
    
};

export default { getSubtitles };