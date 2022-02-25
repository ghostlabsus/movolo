import Config from "../../config.json";

async function getSubtitles(options) {
    let imdbId = "";

    // convert tmdbId to imdbId
    if (options.tmdbId) {
        imdbId = await fetch(`https://api.themoviedb.org/3/${options.type}/${options.tmdbId}/external_ids?api_key=${Config.tmdbKey}`).then(r => r.json()).then(r => r.imdb_id);
    }  

    if (options.imdbId) {
        imdbId = options.imdbId;
    }

    if (imdbId) {
        const req = await fetch(`https://cors.movolo.workers.dev?url=https://databasegdriveplayer.co/player.php?imdb=${imdbId}`).then(r=>r.text());
        const DOM = new DOMParser().parseFromString(req, "text/html");

        const subtitles = JSON.parse(DOM.querySelector("#subtitlez").textContent);
        return subtitles.map(subtitle => {
            return {
                file: `http:${subtitle.file}`,
                label: subtitle.label,
                kind: "subtitles",
                provider: "gdriveplayer"
            };
        });
    }
}

export default { getSubtitles }