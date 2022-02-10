import Config from "@src/config.json";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = () => {
    return {
        body: {
            scrapers: Config.scrapers.map(scraper => {
                return {
                    name: scraper.name,
                    id: scraper.id,
                    url: scraper.url,
                    types: scraper.types
                }
            }),
            subtitles: Config.subtitles.map(scraper => {
                return {
                    name: scraper.name,
                    id: scraper.id,
                    url: scraper.url,
                }
            })
        }
    }
}

export { get };