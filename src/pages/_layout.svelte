<script>
    import NavLinks from "./_components/NavLinks.svelte";
</script>

<link rel="stylesheet" href="/css/index.css" />

<div class="nav">
    <NavLinks />
</div>
<div class="main">
    <div class="header">
        <a href="https://github.com/lem6ns/Movolo"><h1>Movolo</h1></a>
        <br><br>
        <span>powered by <a href="https://themoviedb.org"><img src="/img/tmdb.svg" alt="TMDB Logo" width="128"/></a> and <a href="https://opensubtitles.org">opensubtitles.org</a></span>
        <br><br><hr><br>
        </div>
    <slot />
</div>
