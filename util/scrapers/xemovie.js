import { JSDOM } from "jsdom";

const search = async (query) => {
    const baseUrl = "https://xemovie.co";
    const url = `${baseUrl}/search?q=${query}`;

    const html = await fetch(url).then(r => r.text());
    const DOM = new JSDOM(html).window.document;
    const movieChildren = DOM.getElementById('"movie"').parentElement.parentElement.querySelector('.grid').children;
    const showChildren = DOM.getElementById('"serie"').parentElement.parentElement.querySelector('.grid').children;

    const movies = [...movieChildren].map(movie => {
        return {
            title: movie.querySelectorAll("div")[1].innerText.replace(/\([0-9]{4}\)/g, "").trim(),
            year: movie.querySelector('.float-right').innerText,
            slug: encodeURIComponent(new URL(movie.querySelector('a').href).pathname),
            subtitles: true
        }
    });
    const shows = [...showChildren].map(movie => {
        return {
            title: movie.querySelectorAll("div")[1].innerText.replace(/\([0-9]{4}\)/g, "").trim(),
            year: movie.querySelector('.float-right').innerText,
            slug: encodeURIComponent(new URL(movie.querySelector('a').href).pathname),
            subtitles: true
        }
    });

    return {
        movies,
        shows
    };
};

const scrape = async (slug) => {


    return;
};

const info = {
    name: "xemovie",
    url: "https://xemovie.co/",
    type: "scraper"
};

export { search, scrape, info };