<script type="ts">
    export let item: import("@src/Types").TmdbApiResult;
</script>

<div class="slide-content">
    <div>
        <h1>{item.title}</h1>
        <img src={item.poster} width="500px" alt="{item.title} Movie Poster" />
    </div>
</div>

<style>
    h1 {
        position: absolute;
        top:0;
    }
</style>