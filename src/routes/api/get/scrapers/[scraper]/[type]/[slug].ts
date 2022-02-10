import Config from "@src/config.json";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const type = params.type;
    const slug = params.slug;

    const scrapers = {
        "xem": (await import(`@scrapers/xemovie`)).default,
        "vidz": (await import(`@scrapers/vidzstore`)).default,
        "vembed": (await import(`@scrapers/vidembed`)).default,
        "gogo": (await import(`@scrapers/gogoplay`)).default,
        // "tf": (await import(`@scrapers/theflix`)).default // their account for cdn got suspended
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