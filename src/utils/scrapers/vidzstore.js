import Config from "../../config.json";

async function scrape(tmdbId) {
    try {
        const baseUrl = `https://cors.movolo.workers.dev/?url=https://stream.vidzstore.com`;
        let movieUrl = "";

        const json = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${Config.tmdbKey}&language=en-US`).then(r => r.json());
        const searchPage = await fetch(`${baseUrl}/search.php?sd=${json.title.replace(/ /g, "_")}`).then(r => r.text());

        const searchDOM = new DOMParser().parseFromString(searchPage, "text/html");
        const videoUrl = `${baseUrl}/${[...searchDOM.querySelectorAll("a")].filter(link => link.innerText.includes("-") && link.innerText.replace(/\-/g, " ").includes(json.title.split(" ").shift()))[0].getAttribute("href")}`;

        const videoPage = await fetch(videoUrl).then(r => r.text());
        const videoDOM = new DOMParser().parseFromString(videoPage, "text/html");

        movieUrl = videoDOM.querySelector("source").src;
        return { url: movieUrl, subtitles: [] };
    } catch {
        return { url: "/nosource.mp4", subtitles: [] };
    }
}

export default { scrape };