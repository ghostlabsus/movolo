<script type="ts">
    export let item: import("@src/Types").TmdbApiResult;
</script>

<div class="slide-content">
    <div class="container">
        <div class="image">
            <img
                src={item.poster}
                width="500px"
                height="751px"
                alt="{item.title} Movie Poster"
            />
        </div>
        <h1 class="title">{item.title}</h1>
    </div>
</div>

<style>
    h1 {
        position: absolute;
        top: 0;
    }

    .container {
        position: relative;
        color: white;
        padding: 5%
    }

    .title {
        position: absolute;
        top: 76%;
    }

    .image {
        display: inline-block;
    }

    .image:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(28,28,28,0) 0%, rgba(255,255,255,0) 67%, rgba(0,0,0,1) 100%); 
    }

    .image img {
        display: block;
    }
</style>
