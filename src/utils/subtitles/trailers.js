import Config from "../../config.json";

async function getSubtitles(options) {
    let imdbId = "";

    if (options.tmdbId) {
        imdbId = await fetch(`https://api.themoviedb.org/3/${options.type}/${options.tmdbId}/external_ids?api_key=${Config.tmdbKey}`).then(r => r.json()).then(r => r.imdb_id);
    }

    if (options.imdbId) {
        imdbId = options.imdbId;
    }

    if (imdbId) {
        try {
            const subtitles = await fetch(`https://trailers.to/subtitles/movolo/imdb/${imdbId}${options.type == "tv" ? `/S${options.season}E${options.episode}` : ""}`).then(r => r.json());
            return subtitles.map(subtitle => {
                return {
                    file: `https://trailers.to/subtitles/${subtitle.ContentHash}/${subtitle.LanguageCode}`,
                    label: `${subtitle.MetaInfo.LanguageName}${subtitle.MetaInfo.SubHearingImpaired == "1" ? " (Hearing Impaired)" : ""}`,
                    kind: "subtitles",
                    provider: "trailers.to"
                };
            });
        } catch {
            return [];
        }
    } else {
        return [];
    }
}

export default { getSubtitles };