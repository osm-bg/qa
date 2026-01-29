<script>
    import Title from '/src/components/Title.svelte';
    import MapView from '/src/components/MapView.svelte';
    import LastUpdate from '/src/components/LastUpdate.svelte';
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet.markercluster';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

    let container_groups_by_type = $state([
        {
            name: 'waste_disposal',
            label: 'Контейнери за смесени отпадъци',
            bg_label: 'Битови отпадъци',
            emoji: '🗑️'
        },
        {
            name: 'package_recycling',
            label: 'Контейнери за разделно събиране',
            bg_label: 'Разделно събиране',
            emoji: '♻️',
            label_func: (tags) => {
                const operator = tags['operator'] ?? 'Неизвестен';
                const count = tags['count'] ?? '?';
                if(show_short_recycling_label) {
                    return `${count}x♻️`;
                }
                if(['Екопак', 'Екобулпак', 'Булекопак'].includes(operator)) {
                    const colour_counts = ['green', 'yellow', 'blue'].map(colour => tags[`count:${colour}`] ?? '?');
                    const colour_emojies = ['🟢', '🟡', '🔵'];
                    const colour_parts = colour_counts
                    .map((count, index) => {
                        if(['?', '0'].includes(count)) {
                            return null;
                        }
                        return `${count}x${colour_emojies[index]}`;
                    })
                    .filter(part => part !== null);
                    if(colour_parts.length > 0) {
                        return `${count}x♻️ (${colour_parts.join(', ')})`;
                    }
                }
                return `${count}x♻️`;
            },
            is_complete_func: (tags) => {
                const required_tags = ['count:green', 'count:yellow', 'count:blue'];
                const required_operators = ['Екопак', 'Екобулпак', 'Булекопак'];
                const operator = tags['operator'] ?? 'Неизвестен';
                if(required_operators.includes(operator)) {
                    if(required_tags.every(tag => tag in tags)) {
                        return true;
                    }
                }
                else {
                    return tags.count !== undefined;
                }
                return false;
            }
        },
        {
            name: 'pet_container',
            label: 'Контейнери за PET бутилки',
            bg_label: 'PET бутилки',
            emoji: '💧'
        },
        {
            name: 'clothes_recycling',
            label: 'Контейнери за дрехи',
            bg_label: 'Дрехи',
            emoji: '👕'
        },
        {
            name: 'electronic_recycling',
            label: 'Контейнери за електронни отпадъци',
            bg_label: 'Електронни отпадъци',
            emoji: '📱'
        },
        {
            name: 'battery_recycling',
            label: 'Контейнери за батерии',
            bg_label: 'Батерии',
            emoji: '🔋'
        },
        {
            name: 'bottle_return_machine',
            label: 'Машини за връщане на бутилки',
            bg_label: 'Връщане на бутилки',
            emoji: '🍼'
        },
        {
            name: 'cooking_oil',
            label: 'Контейнери за използвано готварско олио',
            bg_label: 'Готварско олио',
            emoji: '🛢️'
        },
        {
            name: 'plastic_caps',
            label: 'Контейнери за пластмасови капачки',
            bg_label: 'Пластмасови капачки',
            emoji: '🩷'
        },
        {
            name: 'drugs',
            label: 'Контейнери за лекарства с изтекъл срок на годност',
            bg_label: 'Лекарства',
            emoji: '💊'
        },
        {
            name: 'unknown_type',
            label: 'Неизвестен тип контейнер',
            bg_label: 'Неизвестен тип',
            emoji: '❓'
        },
        {
            name: 'unknown_waste',
            label: 'Неизвестен отпадък',
            bg_label: 'Неизвестен отпадък',
            emoji: '❓'
        }
    ]);
    let show_short_recycling_label = $state(true);
    let mapComponent;
    let last_update_date = $state(null);
    const container_groups = [];
    onMount(async () => {
        const markers = [];
        const raw_data = await fetch(new URL('./waste-containers.json', import.meta.url));
        const data = await raw_data.json();
        container_groups.push(...data.data);
        const map = mapComponent.get_map();
        last_update_date = new Date(data.date);
        const cluster_group = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 17,
        });
        for(const group of container_groups) {
            function find_avg_coords(containers) {
                let sum_lat = 0;
                let sum_lon = 0;
                let count = 0;
                for(const container of containers) {
                    if(container.coords && container.coords.length === 2) {
                        sum_lat += container.coords[0];
                        sum_lon += container.coords[1];
                        count ++;
                    }
                }
                if(count === 0) {
                    return [0, 0];
                }
                return [sum_lat / count, sum_lon / count];
            }
            const avg_coords = find_avg_coords(group.containers);
            const icon = get_group_icon(group.containers);
            const popup = L.popup().setContent('<span class="fs-5">' + group.containers.map(container => {
                const url = `https://www.openstreetmap.org/${container.type}/${container.id}`;
                const anchor = `<a href="${url}" target="_blank">${container.type[0]} ${container.id}</a>`;
                return anchor;
            }).join('<br/>') + '</span>');
            group.marker = L.marker(avg_coords, {
                icon: icon,
                riseOnHover: true
            }).bindPopup(popup);
            markers.push(group.marker);
        }
        cluster_group.addLayers(markers);
        cluster_group.addTo(map);
        
        for(const waste_group of container_groups_by_type) {
            const location_count = container_groups
                .map(g => g.containers.filter(c => c.cat === waste_group.name).length)
                .reduce((curr, acc) => curr + acc, 0);
            waste_group.location_count = location_count;
        }
    });

    function get_group_icon(containers) {
        const labels = containers.map(container => {
            const waste_group = container_groups_by_type.find(g => g.name === container.cat);
            const is_complete = waste_group.is_complete_func ? waste_group.is_complete_func(container.tags) : container.tags.count !== undefined;
            const label_style = is_complete ? '' : 'bg-warning';
            const label_text = waste_group.label_func
                ? waste_group.label_func(container.tags)
                : `${container.tags.count ?? '?'}x${waste_group.emoji}`;
            if(label_style) {
                return `<span class="${label_style}">${label_text}</span>`;
            }
            return label_text;
        });
        return L.divIcon({
            html: `<span class="marker-label p-1 text-nowrap bg-white rounded-3 fs-6 text-center border border-2 border-dark">${labels.join('<br/>')}</span>`,
        });
    }

    function update_recycling_labels() {
        for(const group of container_groups) {
            if(!group.containers.some(c => c.cat === 'package_recycling')) {
                continue;
            }
            group.marker.setIcon(get_group_icon(group.containers));
        }
    }
</script>

<style>
    :global(.marker-label) {
        position: absolute;
        transform: translate(-50%, -50%);
        left: 0;
        top: 0;

        padding: 0.25rem 0.5rem;
        white-space: nowrap;
        border-radius: 0.5rem;
        font-size: 1.25rem;
        text-align: center;
    }
</style>

<Title title="Контейнери за отпадъци" />

<input class="form-check-input" type="checkbox" bind:checked={show_short_recycling_label} onchange={update_recycling_labels} id="short_recycling_label_checkbox" />
<label class="form-check-label mb-3" for="short_recycling_label_checkbox">
    Кратки етикети за контейнери за разделно събиране
</label>
<MapView bind:this={mapComponent} height="750px" startZoom={8} maxZoom={20} />
<table class="table table-bordered mt-2">
    <thead>
        <tr class="table-secondary text-center">
            <th colspan="2">Легенда</th>
            <th>Брой локации</th>
        </tr>
    </thead>
    <tbody>
        {#each container_groups_by_type as group}
            <tr>
                <td class="text-center">{group.emoji}</td>
                <td>{group.label}</td>
                <td>{group.location_count ?? 'N/A'}</td>
            </tr>
        {/each}
    </tbody>
</table>
<LastUpdate date={last_update_date} />