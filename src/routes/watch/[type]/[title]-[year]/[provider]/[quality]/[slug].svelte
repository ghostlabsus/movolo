<script>
    import { page } from "$app/stores";
    let { provider, slug, type, quality, title, year } = $page.params;
    let url = "";
    let error = "";

    const fetchData = async () => {
        const json = await fetch(
            `/api/get/scrapers/${provider}/${type}/${encodeURIComponent(slug)}`
        ).then((r) => r.json());

        if (json.qualities?.length && quality != "default") {
            for (const q of json.qualities) {
                if (q.quality === quality) {
                    url = q.url;
                    break;
                }
            }
        } else {
            url = json.url;
        }

        if (json.error) {
            error = json.error;
        } else if (!url && quality != "default") {
            error = "Invalid quality.";
        } else if (!url) {
            error = "Incorrect type, provider or slug.";
        }

        if (isNaN(parseInt(year))) {
            title = `${title}-${year.slice(0, -5)}`;
            year = year.slice(-4);
        }

        return json;
    };
</script>

{#await fetchData()}
    <h1>Loading...</h1>
{:then info}
    {#if provider == "gogo" || "vembed"}
        <code>{url}</code>
        <h1>Use a video player like <a href="https://wiki.videolan.org/VLC_command-line_help/">VLC</a> or <a href="https://mpv.io/manual/master/#options-referrer">MPV</a> to play this video above. <strong>PLEASE</strong> set the referrer to <code>{provider == "gogo" ? "https://gogoplay.io" : "https://vidembed.io"}</code>, or it will not work.</h1>
        <br>
        {#if info.qualities}
            <h2>Qualities</h2>
            <ul>
                {#each info.qualities as { quality }}
                    <li>{quality}</li>
                {/each}
            </ul>
        {/if}

        <h2>Title: {title}</h2>
        <h2>Year: {year}</h2>

        <h2>Current Quality: {quality}</h2>
    {:else if error}
        <h1>{error}</h1>
    {:else}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video controls>
            <source src={url} type="video/mp4" />
        </video>

        {#if info.qualities}
            <h2>Qualities</h2>
            <ul>
                {#each info.qualities as { quality }}
                    <li>{quality}</li>
                {/each}
            </ul>
        {/if}

        <h2>Title: {title}</h2>
        <h2>Year: {year}</h2>

        <h2>Current Quality: {quality}</h2>
    {/if}
{/await}
