import Config from "../../config.json";

async function getSubtitles(options) {
    let imdbId = "";

    function parseJSON(json) {
        const formattedSubtitles = [];
        const subtitles = json.filter(sub => sub.SubFileName.toLowerCase().endsWith("srt"));
        for (const subtitle of subtitles) {
            if (subtitle.InfoFormat) {
                formattedSubtitles.push({
                    file: `${new URL(subtitle.SubDownloadLink).origin}/${new URL(subtitle.SubDownloadLink).pathname.split(".").shift()}`,
                    label: `${new Intl.DisplayNames(["en"], { "type": "language" }).of(subtitle.ISO639.replace("pb", "pt"))}${subtitle.SubHearingImpaired == "1" ? " (Hearing Impaired)" : ""}`,
                    kind: "subtitles",
                    provider: "opensubtitles"
                });
            }
        }
        return formattedSubtitles
    }

    if (options.tmdbId) {
        // convert tmdbId to imdbId
        imdbId = await fetch(`https://api.themoviedb.org/3/${options.type}/${options.tmdbId}/external_ids?api_key=${Config.tmdbKey}`).then(r => r.json()).then(r => r.imdb_id);
    }

    if (options.imdbId) {
        imdbId = options.imdbId;
    }

    if (imdbId) {
        const json = await fetch(`https://rest.opensubtitles.org/search/${options.episode ? `episode-${options.episode}/` : ""}imdbid-${imdbId.replace("tt", "")}${options.season ? `/season-${options.season}` : ""}`, {
            headers: {
                "X-User-Agent": "Movolo"
            }
        }).then(r => r.json());

        return parseJSON(json);
    }

    if (options.query) {
        const json = await fetch(`https://rest.opensubtitles.org/search/query-${encodeURIComponent(options.query).replace(/ /g, "+")}${(options.season && options.episode) ? `/season-${options.season}/episode-${options.episode}` : ""}`, {
            headers: {
                "X-User-Agent": "Movolo"
            }
        }).then(r => r.json());

        return parseJSON(json);
    }
}

export default { getSubtitles };