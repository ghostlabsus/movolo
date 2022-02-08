import Info from "@src/info.json";

/** @type {import('@sveltejs/kit').RequestHandler} */
const get = () => {
    return {
        body: Info
    }
}

export { get };