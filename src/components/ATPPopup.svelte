<script>
    export let main_tag;
    export let atp;
    export let osm;
    export let compare_keys = [];
    export let tags_table = {};
</script>
<b>{main_tag}</b><br/>
{#if atp}
    <strong>ATP:</strong><br/>
    Име: {atp.name}<br/>
    Координати: {atp.coordinates[0]}, {atp.coordinates[1]}<br/>
{/if}
{#if osm}
    <strong>OSM:</strong><br/>
    Име: {osm.name}<br/>
    Координати: {osm.coordinates[0]}, {osm.coordinates[1]}<br/>
{/if}
{#if atp && compare_keys !== false}
    <strong>Тагове:</strong><br/>
    <table class="table table-bordered table-sm">
        <thead>
            <tr class="table-secondary text-center">
                <th>Таг</th>
                <th>OSM</th>
                <th>ATP</th>
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(tags_table) as [key, value]}
                <tr
                    class="{value.colour || ''}">
                    <td>{key}</td>
                    <td>{value.osm || ''}</td>
                    <td>{value.atp || ''}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}