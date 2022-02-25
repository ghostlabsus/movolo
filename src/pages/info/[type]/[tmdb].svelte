<script>
    import { params } from '@roxi/routify';
    import { onMount } from 'svelte'
    import Config from "../../../config.json";

    let info = {
        "title": "Placeholder",
        "overview": "Placeholder",
        "seasons": []
    };
    let server = "theflix",
        subtitleServer = "trailers";

    onMount(async () => {
        if ($params.type == "movie") {
            let movie = await fetch(`https://api.themoviedb.org/3/movie/${$params.tmdb}?api_key=${Config.tmdbKey}&language=en-US`);
            let movieData = await movie.json();
            info = movieData;
        };
        if ($params.type == "tv") {
            let tv = await fetch(`https://api.themoviedb.org/3/tv/${$params.tmdb}?api_key=${Config.tmdbKey}&language=en-US`);
            let tvData = await tv.json();
            info = tvData;
            info.seasons = [];
            for (let i = 1; i <= info.number_of_seasons; i++) {
                let season = await fetch(`https://api.themoviedb.org/3/tv/${$params.tmdb}/season/${i}?api_key=${Config.tmdbKey}&language=en-US`);
                let seasonData = await season.json();
                info.seasons.push(seasonData);
                info.seasons = info.seasons;
            };
        };
    })

    const showEpisodes = (season) => {
        [...document.querySelectorAll(".season")].forEach(el => el.style.display = "none");
        [...document.querySelectorAll(".season-container")].forEach(el => el.style.display = "none");
        [...document.querySelectorAll(`div[data-season='${season}']`)].forEach(el => el.style.display = "");
    }

    const showSeasons = (season) => {
        [...document.querySelectorAll(".season")].forEach(el => el.style.display = "inline");
        [...document.querySelectorAll(".season-container")].forEach(el => el.style.display = "inline");
        [...document.querySelectorAll(`div[data-season='${season}']`)].forEach(el => el.style.display = "none");
    }
</script>

<main>
    <span onclick="history.back();"><strong>X</strong></span>
    {#if info?.backdrop_path}
        <img src="https://image.tmdb.org/t/p/original{ info?.backdrop_path }" alt="Backdrop"/>
    {:else}
        <img src="https://dummyimage.com/1920x1080/000/ffffff&text=++No+Backdrop+Available" alt="Backdrop"/>
    {/if}
    <h1>{info?.title ? info?.title : info?.name}</h1>
    <p>{info?.overview ? info.overview : "No overview available."}</p>
    <p>{info?.title ? info?.title : info?.name} has a { Math.round((info.vote_average/10).toFixed(2)*100) }% score, rated by users.</p>
    <br>
    <select bind:value={server}>
        {#each Config.scrapers[$params.type] as server}
            <option value="{server.id}">{server.name}</option>
        {/each}
    </select>
    <br>
    <select bind:value={subtitleServer}>
        <option value="none">None</option>
        {#each Config.subtitles as server}
            <option value="{server.id}">{server.name}</option>
        {/each}
    </select>
    <br>
    <br>
    {#if info.status != "Planned" && $params.type == "movie"}
        <a href="/player/{server}/{subtitleServer}/{$params.tmdb}" style="margin:10px">STREAM</a>
    {:else if info.status != "Planned" && $params.type == "tv"}
        {#each info.seasons as season}
            <div class="season-container" style="display: inline;">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a class="season" href="javascript:void(0);" on:click={showEpisodes(season.season_number)}>Season {season.season_number}</a>
                {#if !(season.season_number % 5)}
                    <br><br>
                {/if} 
            </div>
            <div data-season="{season.season_number}" style="display: none; overflow: scroll; overflow-x: hidden; height: 300px">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <br>
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a class="episode" style="background: #2e2e2e !important;" href="javascript:void(0);" on:click={showSeasons(season.season_number)}>Back</a>
                <br><br>
                    {#each season.episodes as episode}
                        {#if window.localStorage[`${$params.tmdb}tv`] && JSON.parse(window.localStorage[`${$params.tmdb}tv`])?.seasons[season.season_number]?.episodes[episode.episode_number]}
                            <a class="episode" style="background: rgb(0,120,0) !important" href="/player/{server}/{subtitleServer}/{$params.tmdb}/{season.season_number}/{episode.episode_number}">Ep. {episode.episode_number}</a>
                        {:else}
                            <a class="episode" href="/player/{server}/{subtitleServer}/{$params.tmdb}/{season.season_number}/{episode.episode_number}">Ep. {episode.episode_number}</a>
                        {/if}
                        {#if !(episode.episode_number % 9)}
                            <br><br>
                        {/if}
                    {/each}
            </div>
        {/each}
    {:else}
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class="disable" href="javascript:void(0);">UNABLE TO STREAM</a>
    {/if}
</main>

<style>
    main {
        display: inline-block;
        background-color: #171717;
        width: 99%;
        box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
        border-radius: 5px;
        text-align: center;
        padding: 5px;
    }
    main img {
        float: left;
        width: 60%;
        border-radius: 5px;
    }
    main p {
        padding-left: 61%;
        padding-right: 1%;
    }
    main span {
        cursor: pointer;
    }
    main a {
        -webkit-border-radius: 28;
        -moz-border-radius: 28;
        border-radius: 28px;
        font-family: Arial;
        color: #BCC4DB;
        font-size: 30px;
        background: #262729;
        padding: 10px 20px 10px 20px;
        text-decoration: none;
        -webkit-text-stroke-width: 0.5px;
        -webkit-text-stroke-color: black;
    }

    main a:hover {
        background: #3a3c3f;
        text-decoration: none;
    }

    .disable {
        -webkit-border-radius: 28;
        -moz-border-radius: 28;
        border-radius: 28px;
        font-family: Arial;
        color: #ffffff;
        font-size: 20px;
        background: #8c8c8c;
        padding: 10px 20px 10px 20px;
        text-decoration: none;
    }

    .disable:hover {
        cursor: default;
        background: #8c8c8c;
        text-decoration: none;
    }

    main span {
        position: absolute;
        right: 1.5%;
        color: red;
    }
</style>