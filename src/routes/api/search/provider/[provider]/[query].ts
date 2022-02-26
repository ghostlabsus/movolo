/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const type = params.type;
    const query = params.query;

    const scrapers = {
        "xem": (await import(`@scrapers/xemovie`)).default,
        "vidz": (await import(`@scrapers/vidzstore`)).default,
        "vembed": (await import(`@scrapers/vidembed`)).default,
        "gogo": (await import(`@scrapers/gogoplay`)).default,
        "tf": (await import(`@scrapers/theflix`)).default,
        "gdrive": (await import(`@scrapers/gdriveplayer`)).default
    };

    const scraper = scrapers[params.provider];
    if (!scraper) return {
        status: 404,
        body: {
            error: "Scraper not found"
        }
    };

    const movieResults = await scraper.search(query, "movie");
    const tvResults = await scraper.search(query, "tv");

    const results = [movieResults, tvResults];

    return {
        body: results
    }
}

export { get };