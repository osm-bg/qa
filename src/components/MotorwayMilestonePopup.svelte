<script>
    export let ids = [];
    export let distance;
    export let motorway;
</script>

<span>{motorway} км. {distance}</span>
{#if ids.length}
    <div>OSM IDs:
        {#each ids as id, index}
            {#if index > 0}, {/if}
            <a href="https://osm.org/node/{id}" target="_blank">n{id}</a>
        {/each}
    </div>
{/if}