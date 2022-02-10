import Config from "@src/config.json";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const type = params.type;
    const slug = params.slug;

    const scrapers = {
        "xem": await import(`@scrapers/xemovie`),
        "vidz": await import(`@scrapers/vidzstore`),
        "vembed": await import(`@scrapers/vidembed`),
        "gogo": await import(`@scrapers/gogoplay`),
        "tf": await import(`@scrapers/theflix`)
    };
    
    const scraper = scrapers[params.scraper];
    if (!scraper) return {
        status: 404,
        body: {
            error: "Scraper not found"
        }
    };

    return {
        body: await scraper.scrape(slug, type)
    };
};

export { get };