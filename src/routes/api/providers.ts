import Config from "@src/config.json";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = () => {
    return {
        body: {
            scrapers: Config.scrapers,
            subtitles: Config.subtitles
        }
    }
}

export { get };