import gogoplay from "@scrapers/gogoplay";
import theflix from "@scrapers/theflix";
import vidembed from "@scrapers/vidembed";
import vidzstore from "@scrapers/vidzstore";
import xemovie from "@scrapers/xemovie";
import gdriveplayer from "@scrapers/gdriveplayer";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const query = params.query;

    const movieResults = await Promise.all([
        await theflix.search(query, "movie"),
        await vidzstore.search(query, "movie"),
        await xemovie.search(query, "movie"),
        await gogoplay.search(query, "movie"),
        await vidembed.search(query, "movie"),
        await gdriveplayer.search(query, "movie"),
    ]);
    const tvResults = await Promise.all([
        await theflix.search(query, "tv"),
        await vidzstore.search(query, "tv"),
        await xemovie.search(query, "tv"),
        await gogoplay.search(query, "tv"),
        await vidembed.search(query, "tv"),
        await gdriveplayer.search(query, "tv"),
    ]);
    
    const results = [movieResults.filter(r => r.length > 0), tvResults.filter(r => r.length > 0)];
    
    return {
        body: results
    }
}

export { get };