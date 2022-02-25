import Config from "../../config.json";

async function scrape(tmdbId, type, episode, season) {
    const baseUrl = `https://cors.movolo.workers.dev/?url=https://theflix.to`;
    let movieUrl = "";

    const json = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${Config.tmdbKey}&language=en-US`).then(r => r.json());
    const request = await fetch(`${baseUrl}/${type == "movie" ? "movie" : "tv-show"}/${tmdbId}-${(type == "movie") ? json.title.toLowerCase().replace(/\ /g, "-").replace(/[^\w-]/g, "") : json.name.toLowerCase().replace(/\ /g, "-").replace(/[^\w-]/g, "")}${type == "tv" ? `/season-${season}/episode-${episode}`: ""}`).then(r => r.text());

    const DOM = new DOMParser().parseFromString(request, "text/html");
    const script = JSON.parse(DOM.querySelector("#__NEXT_DATA__").textContent);

    if (script.page == "/404" || !script.props.pageProps.videoUrl) return { url: "/nosource.mp4", subtitles: [] };

    movieUrl = script.props.pageProps.videoUrl;
    return { url: movieUrl, subtitles: [] };
}

export default { scrape };