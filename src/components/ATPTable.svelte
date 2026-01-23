<script>
    import ATPTableRow from './ATPTableRow.svelte';
    export let spiders_data = [];
    export let title = undefined;
    export let by_categories = false;
    let show_kv_instead_of_name = !by_categories;
</script>

<table class="table table-bordered table-sm">
    <thead>
        {#if title != undefined}
        <tr>
            <th colspan="5" class="text-center">{title}</th>
        </tr>
        {/if}
        <tr class="table-secondary text-center align-middle">
            <th>Име / Таг</th>
            <th>Обекти в ATP</th>
            <th>Обекти в OSM</th>
            <th>% съвпадение</th>
        </tr>
    </thead>
    <tbody>
        {#if by_categories}
            {#each spiders_data as category}
                <tr>
                    <th colspan="5" class="table-secondary text-center">
                        {category.key}={category.value}
                    </th>
                </tr>
                {#each category.spiders as spider_data}
                    <ATPTableRow {spider_data} {show_kv_instead_of_name}/>
                {/each}
            {/each}
        {:else}
            {#each spiders_data as spider_data}
                <ATPTableRow {spider_data} {show_kv_instead_of_name}/>
            {/each}
        {/if}
    </tbody>
</table>