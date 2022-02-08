import Info from "@src/info.json";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const BASE_URL = Info.scrapers.find(s => s.id === "tf").url;

const search = async (query: string) => {

};

const scrape = async (slug: string) => {

};

export default { search, scrape };