import Config from "../../config.json";
import Fuse from "fuse.js";

async function scrape(tmdbId, type, episode, season) {
    const baseUrl = `https://cors.movolo.workers.dev/?url=https://xemovie.co`;
    let movieUrl = "/nosource.mp4",
        subtitles = [];

    const json = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${Config.tmdbKey}&language=en-US`).then(r => r.json());
    const searchPage = await fetch(`${baseUrl}/search?q=${type == "movie" ? encodeURIComponent(json.title) : encodeURIComponent(json.name)}${season ? season : " "}`).then(r => r.text());

    const searchDOM = new DOMParser().parseFromString(searchPage, "text/html");
    const movieArray = [...searchDOM.getElementById(`"movie"`).parentElement.parentElement.querySelectorAll("a")].filter(link => !link.className).map(link =>{
        return {
            link: link.href, name: link.parentElement.innerText.split("\n").filter(a=>a)[0].split(" (")[0]
        }
    });
    const seriesArray = [...searchDOM.getElementById(`"serie"`).parentElement.parentElement.querySelectorAll("a")].filter(link => !link.className).map(link =>{
        return {
            link: link.href, name: link.parentElement.innerText.split("\n").filter(a=>a)[0].split(" (")[0]
        }
    });
    const videoUrls = [
        `https://cors.movolo.workers.dev/?url=${type == "movie" ? new Fuse(movieArray, {keys: ["name"]}).search(json.title)[0].item.link : new Fuse(seriesArray, {keys: ["name"]}).search(json.name)[0].item.link}${episode ? `-ep${episode}` : ""}/watch`,
        `https://cors.movolo.workers.dev/?url=${type == "movie" ? new Fuse(movieArray, {keys: ["name"]}).search(json.title)[0].item.link : new Fuse(seriesArray, {keys: ["name"]}).search(json.name)[0].item.link}${episode ? `-episode-${episode}` : ""}/watch`,
        `https://cors.movolo.workers.dev/?url=${type == "movie" ? new Fuse(movieArray, {keys: ["name"]}).search(json.title)[0].item.link : new Fuse(seriesArray, {keys: ["name"]}).search(json.name)[0].item.link}${episode ? `-ep-${episode}` : ""}/watch`, 
        `https://cors.movolo.workers.dev/?url=${type == "movie" ? new Fuse(movieArray, {keys: ["name"]}).search(json.title)[0].item.link : new Fuse(seriesArray, {keys: ["name"]}).search(json.name)[0].item.link}${episode ? `-ep${parseInt(episode).toLocaleString("en-US", { minimumIntegerDigits: 2 })}` : ""}/watch`
    ];

    for (const videoUrl of videoUrls) {
        try {
            const videoPage = await fetch(videoUrl).then(r => r.text());
            const videoDOM = new DOMParser().parseFromString(videoPage, "text/html");

            for (const script of videoDOM.scripts) {
                if (script.textContent.match(/https:\/\/s[0-9]\.xemovie\.com/)) {
                    let data = JSON.parse(JSON.stringify(eval(`(${script.textContent.replace("const data = ", "").split("};")[0]}})`)));
                    movieUrl = data.playlist[0].file;
                    subtitles = data.playlist[0].tracks;
                }
            }
        } catch {
            continue;
        }
    }

    if (movieUrl.endsWith(".m3u8")) movieUrl = "/nosource.mp4";
    if (!subtitles.length) subtitles = [];

    return { url: movieUrl, subtitles: subtitles };
}

export default { scrape };  