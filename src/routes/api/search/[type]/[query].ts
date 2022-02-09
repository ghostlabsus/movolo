import theflix from "@scrapers/theflix";
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
    ]);

    return {
        body: results
    }
}

export { get };