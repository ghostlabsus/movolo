import Config from "@src/config.json";
const HTMLParser = require("node-html-parser");

const BASE_URL = Config.scrapers.find(s => s.id === "xem").url;

const search = async (query: string, type: "movie" | "series") => {

};

const scrape = async (slug: string) => {

};

export default { search, scrape };