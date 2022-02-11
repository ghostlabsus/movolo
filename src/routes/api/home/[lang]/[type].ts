import Config from "@src/config.json";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const type = params.type;
    const lang = params.lang;

    const results = await Promise.all([
        await getPopular(type, lang),
        await getTrending(type, lang),
        await getTopRated(type, lang),
    ]);

    return {
        body: results
    }
};

const getPopular = async (type: "movie" | "tv", lang: string) => {
    // get popular movies/tv from tmdb api
    const json = await fetch(`https://api.themoviedb.org/3/${type}/popular?api_key=${Config.tmdbApiKey}&language=${lang}&page=1`).then(res => res.json());
    return json.results;
}

const getTrending = async (type: "movie" | "tv", lang: string) => {
    // get trending movies/tv from tmdb api
    const json = await fetch(`https://api.themoviedb.org/3/trending/${type}/day?api_key=${Config.tmdbApiKey}&language=${lang}`).then(res => res.json());
    return json.results;
}

const getTopRated = async (type: "movie" | "tv", lang: string) => {
    // get top rated movies/tv from tmdb api
    const json = await fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${Config.tmdbApiKey}&language=${lang}&page=1`).then(res => res.json());
    return json.results;
}

export { get };