<script>
    import { base } from '$app/paths';
    export let spider_data = {};
    export let show_kv_instead_of_name = false;
</script>

<tr>
    <td>
        {#if show_kv_instead_of_name}
            {spider_data.key}={spider_data.value}
        {:else}
            <a href="{base}/atp-osm/{spider_data.spider}/">
                {spider_data.name}
            </a>
        {/if}
    </td>
    <td>{spider_data.stats.atp}</td>
    <td>{spider_data.stats.osm}</td>
    <td>{spider_data.stats.percent_atp_to_osm_matched}%</td>
</tr>