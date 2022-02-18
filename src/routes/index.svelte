<script type="ts">
    import MainCarousel from "@src/components/Carousel/Main/Carousel.svelte";
    import Carousel from "@src/components/Carousel/Carousel.svelte";
    const fetchData = async (type: "movie" | "tv") => {
        const data = await fetch(`/api/home/en/${type}`).then(r => r.json());
        return data;
    };
</script>

{#await fetchData("movie")}
    <h1>Loading...</h1>
{:then items} 
    <Carousel list={items[0]}/>
{/await}