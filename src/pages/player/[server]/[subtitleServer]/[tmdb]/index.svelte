<script>
    import { params, goto } from '@roxi/routify';
    import { onMount } from 'svelte';
    let { tmdb, server, subtitleServer } = $params,
        videoUrl = "/loading.mp4",
        subtitles = [];

    onMount(async () => {
        const { scrape } = (await import(`../../../../../utils/scrapers/${server}.js`)).default;
        const { getSubtitles } = (await import(`../../../../../utils/subtitles/${subtitleServer}.js`)).default;
        let object = await scrape(tmdb, "movie");
        videoUrl = object.url;
        document.querySelector("video").oncanplay = () => {
            document.querySelector("video").currentTime = parseInt(window.localStorage[tmdb]);
            document.querySelector("video").play();
            document.querySelector("video").oncanplay = null;
        }
        subtitles = object.subtitles;
        const subs = await getSubtitles({ tmdbId: tmdb, type: "movie" });
        if (subs) subtitles.push(...subs);
        subtitles.forEach(async (subtitle, index) => {
            if (!subtitle.provider) {
                const subtitleBlob = URL.createObjectURL(await fetch(`https://cors.movolo.workers.dev?url=${subtitle.file}`).then(res => res.blob()));
                subtitles[index].file = subtitleBlob;
            }
            let subtitleText = await fetch(subtitle.file).then(res => res.text())
            subtitleText = subtitleText.startsWith("WEBVTT") ? subtitleText : "WEBVTT\r\n\r\n" + subtitleText.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
            let blob = new Blob([subtitleText], {type: 'text/vtt'});
            const subtitleBlob = window.URL.createObjectURL(blob);
            subtitles[index].file = subtitleBlob;
        });
        document.querySelector("video").addEventListener("error", () => {
            videoUrl = "/later.mp4";
        });

        document.querySelector("video").ontimeupdate = () => {
            window.localStorage[tmdb] = document.querySelector("video").currentTime-2.5
        }
    });
</script>

<span id="close" title="Go home" on:click={() => {$goto('/')}}><strong>❌</strong></span>
<!-- svelte-ignore a11y-media-has-caption -->
<video controls autoplay title="Video" src="{ videoUrl }" id="video">
    {#each subtitles as subtitle}
        <track kind={ subtitle.kind } src="{ subtitle.file }" label="{ subtitle.label }">
    {/each}
</video>