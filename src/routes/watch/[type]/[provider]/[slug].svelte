<script>
    import { page } from "$app/stores";
    const { provider, slug, type } = $page.params;
    let sources;

    const fetchData = async () => {
        const json = await fetch(
            `/api/get/scrapers/${provider}/${type}/${encodeURIComponent(slug)}`
        ).then((r) => r.json());

        if (json.qualities) {
            sources = json.qualities.map((r) => r.url);
        } else {
            sources = [json.url];
        }

        return json;
    };
</script>

{#await fetchData()}
    <h1>Loading...</h1>
{:then info}
{/await}