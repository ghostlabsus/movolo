import gogoplay from "@scrapers/gogoplay";
import theflix from "@scrapers/theflix";
import vidembed from "@scrapers/vidembed";
import vidzstore from "@scrapers/vidzstore";
import xemovie from "@scrapers/xemovie";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const type = params.type;
    const query = params.query;

    const results = await Promise.all([
        await theflix.search(query, type),
        await vidzstore.search(query, type),
        await xemovie.search(query, type),
        await gogoplay.search(query, type),
        await vidembed.search(query, type),
    ]);

    return {
        body: results.filter(r => r.length > 0)
    }
}

export { get };