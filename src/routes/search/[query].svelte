<script type="ts">
    let timer;
    let results = [];
    
    const debounce = (e: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log(e);
        }, 1000);
    };
</script>
