import Config from "@src/config.json";
import type { TmdbApiResult } from "@src/Types";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = async ({ params }) => {
    const { type, lang } = params;

    const results = await Promise.all([
        await getPopular(type, lang),
        await getTrending(type, lang),
        await getTopRated(type, lang),
    ]);

    return {
        body: results
    }
};

const getPopular = async (type: "movie" | "tv", lang: string): Promise<TmdbApiResult[]> => {
    // get popular movies/tv from tmdb api
    const json = await fetch(`https://api.themoviedb.org/3/${type}/popular?api_key=${Config.tmdbApiKey}&language=${lang}&page=1`).then(res => res.json());
    return json.results.map(r => {
        return {
            id: r.id,
            title: r.title || r.name,
            year: r.release_date ? parseInt(r.release_date.split("-")[0]) : NaN,
            poster: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w500${r.backdrop_path}`,
            overview: r.overview,
        }
    });
}

const getTrending = async (type: "movie" | "tv", lang: string): Promise<TmdbApiResult[]> => {
    // get trending movies/tv from tmdb api
    const json = await fetch(`https://api.themoviedb.org/3/trending/${type}/day?api_key=${Config.tmdbApiKey}&language=${lang}`).then(res => res.json());
    return json.results.map(r => {
        return {
            id: r.id,
            title: r.title || r.name,
            year: r.release_date ? parseInt(r.release_date.split("-")[0]) : NaN,
            poster: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w500${r.backdrop_path}`,
            overview: r.overview,
        }
    });
}

const getTopRated = async (type: "movie" | "tv", lang: string): Promise<TmdbApiResult[]> => {
    // get top rated movies/tv from tmdb api
    const json = await fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${Config.tmdbApiKey}&language=${lang}&page=1`).then(res => res.json());
    return json.results.map(r => {
        return {
            id: r.id,
            title: r.title || r.name,
            year: r.release_date ? parseInt(r.release_date.split("-")[0]) : NaN,
            poster: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w500${r.backdrop_path}`,
            overview: r.overview,
        }
    });
}

export { get };