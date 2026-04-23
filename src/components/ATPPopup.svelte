<script>
    export let main_tag;
    export let point;
    const osm = point?.osm;
    const atp = point?.atp;
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
    ID: <a href={"https://www.openstreetmap.org/" + osm.type + "/" + osm.id} target="_blank">{osm.type[0].toUpperCase() + osm.type.slice(1)} {osm.id}</a><br/>
    Име: {osm.name}<br/>
    Координати: {osm.coordinates[0]}, {osm.coordinates[1]}<br/>
{/if}
{#if point.dist}
    {#if point.dist > 100}
        <i class="bg-danger text-white fw-bold bi-exclamation-triangle"></i>
    {/if}
    <strong>Разстояние между ATP и OSM обекта:</strong> {Math.round(point.dist, 0)} м<br/>
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
<button 
    class="btn btn-sm btn-secondary"
    onclick={navigator.clipboard.writeText('\n\n' + Object.entries(tags_table).map(([k, v]) => `${k}=${v.atp}`).join('\n'))}>Копирай таговете</button>
{#if osm}
    <a href={`https://www.openstreetmap.org/${osm.type}/${osm.id}`} target="_blank" class="btn btn-sm btn-primary text-white">OSM</a>
    <a href={`https://www.openstreetmap.org/edit?editor=id&${osm.type}=${osm.id}`} target="_blank" class="btn btn-sm btn-primary text-white">iD</a>
{:else}
    <a href={`https://www.openstreetmap.org/#map=19/${atp.coordinates[0]}/${atp.coordinates[1]}`} target="_blank" class="btn btn-sm btn-primary text-white">Покажи в OSM</a>
    <a href={`https://www.openstreetmap.org/edit?editor=id#map=19/${atp.coordinates[0]}/${atp.coordinates[1]}`} target="_blank" class="btn btn-sm btn-primary text-white">Покажи в iD</a>
{/if}
