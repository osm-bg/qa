<script>
    import { mount, unmount, onMount } from 'svelte';
    import { page } from '$app/stores';
    import { load_data } from './../app.js';
    import L from 'leaflet';
    import 'leaflet.markercluster';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import Title from '/src/components/Title.svelte';
    import ATPTable from '/src/components/ATPTable.svelte';
    import ATPLegend from '/src/components/ATPLegend.svelte';
    import MapView from '/src/components/MapView.svelte';
    import ATPPopup from '/src/components/ATPPopup.svelte';
    import { brands_map } from '/src/routes/atp-osm/brands-map.js';
    let spiders_data = [];
    let markers = {};
    let mapComponent = null;
    onMount(async () => {
        const map = mapComponent.get_map();
        function generate_tags_table(osm, atp, compare_keys) {
            const tags_table = {};
            if(compare_keys === false) {
                return tags_table;
            }
            function add_tag(source, key, value) {
                if(!compare_keys.includes(key)) {
                    return;
                }
                if(!tags_table[key]) {
                    tags_table[key] = {};
                }
                tags_table[key][source] = value;
            }
            if(osm && osm.tags) {
                for(const [key, value] of Object.entries(osm.tags)) {
                    add_tag('osm', key, value);
                }
            }
            if(atp && atp.tags) {
                for(const [key, value] of Object.entries(atp.tags)) {
                    add_tag('atp', key, value);
                }
            }
            for(const [key, value] of Object.entries(tags_table)) {
                value.colour = determine_row_colour(value.osm, value.atp);
            }
            return tags_table;
        }
        function determine_row_colour(osm_value, atp_value) {
            if(!osm_value && atp_value) {
                return 'table-success';
            }
            else if(osm_value && atp_value && osm_value !== atp_value) {
                return 'table-warning';
            }
            else if(osm_value && !atp_value) {
                return 'table-danger';
            }
            return '';
        }
        function deterimine_icon_url(osm, atp, tags_table) {
            function distance(coord1, coord2) {
                const xdiff = coord1[0] - coord2[0];
                const ydiff = coord1[1] - coord2[1];
                return Math.sqrt(xdiff * xdiff + ydiff * ydiff) * 111320; // approximate conversion to meters
            }
            const icons = {
                atp_only: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                osm_only: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                different_tags: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                different_distance: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                same: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
            };
            let iconUrl = icons.same;
            if(osm && !atp) {
                iconUrl = icons.osm_only;
            } 
            else if(!osm && atp) {
                iconUrl = icons.atp_only;
            }
            else if(tags_table !== false && Object.values(tags_table).some(tag => tag.colour !== '')) {
                iconUrl = icons.different_tags;
            }
            else if(distance(osm.coordinates, atp.coordinates) > 20) {
                iconUrl = icons.different_distance;
            }
            return iconUrl;
        }
        const spider = $page.params.slug;
        const all_data = await load_data();
        spiders_data = all_data
        .filter(group => group.spiders.some(s => s.spider === spider))
        .flatMap(group => group.spiders)
        .filter(s => s.spider === spider);

        for (const spider of spiders_data) {
            const key = `${spider.key}-${spider.value}-${spider.spider}`;
            const response = await fetch(brands_map.get(key));
            const data = (await response.json());
            data.data = data.data.filter(item => item.osm || item.atp);
            markers[key] = data;
        }
        console.log(markers);

        function create_popup(atp, osm, compare_keys, tags_table, main_tag) {
            const container = document.createElement('div');
            const destroy = mount(ATPPopup, {
                target: container,
                props: { atp, osm, compare_keys, tags_table, main_tag }
            });
            container._destroy = destroy;
            return container;
        }

        const cluster = L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: false,
        });

        Object.values(markers).forEach(marker_group => {
            marker_group.data.forEach(p => {
                const coordinates = p.osm ? p.osm.coordinates : p.atp.coordinates;
                const tags_table = generate_tags_table(p.osm, p.atp, marker_group.metadata.compare_keys);
                const marker = L.marker(coordinates, {
                    icon: L.icon({
                        iconUrl: deterimine_icon_url(p.osm, p.atp, tags_table),
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                    })
                });

                marker.bindPopup(create_popup(p.atp, p.osm, marker_group.metadata.compare_keys, tags_table, `${marker_group.metadata.key}=${marker_group.metadata.value}`));
                cluster.addLayer(marker);
            });
        });

        map.addLayer(cluster);
        map.on('popupclose', e => {
            e.popup.getContent()?.destroy?.();
        });
    });
</script>

<Title title={spiders_data[0]?.name + ' - ATP - OSM Интеграция'}/>

<div class="row">
    <div class="col-12 col-sm-5">
        <div class="alert alert-warning d-none" id="fuzzy_coords_notice">
            <span class="fw-bold">Възможни значителни отклонения в координатите (50-200 метра)</span>
        </div>
        <ATPTable spiders_data={spiders_data} by_categories={false} title={spiders_data[0]?.name}/>
    </div>
    <div class="col-12 col-sm-7">
        <div style="height: 500px;">
            <MapView bind:this={mapComponent}/>
        </div>
        <ATPLegend/>
    </div>
</div>
