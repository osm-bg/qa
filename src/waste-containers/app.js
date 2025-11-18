import { init_map } from '/src/assets/js/map.js';
import { make_osm_link } from '/src/assets/js/utils.js';

import L, { popup } from 'leaflet';
import { markerClusterGroup } from 'leaflet.markercluster';

function add_container_to_map(marker_cluster, containers, category) {
    const {name: type, emoji: icon_emoji} = category;
    for(const container of containers) {
        let label = icon_emoji;
        if(category.label_func) {
            label = category.label_func(container.tags);
        }
        else {
            if(!type.startsWith('unknown')) {
                const count = container.tags['count'] ?? '?';
                label = `${count}x${icon_emoji}`;
            }
        }
        const is_complete = typeof container.tags['count'] !== 'undefined';
        const div_icon = L.divIcon({
            className: 'fs-5',
            html: `<span class="p-1 text-nowrap ${is_complete ? 'bg-white' : 'bg-warning'} rounded-3">${label}</span>`,
        });
        const popup_rows = [
            `Брой: ${container.tags.count ?? 'Неизвстен'}`,
            `Оператор: ${container.tags.operator ?? 'Неизвестен'}`,
            make_osm_link('node', container.id)
        ]
        const marker = L.marker(container.coords, { icon: div_icon, riseOnHover: true });
        marker.bindPopup(popup_rows.join('<br/>'));
        marker.addTo(marker_cluster);
    }
}

let map;
async function start() {
    map = init_map();
    const raw_data = await fetch(new URL('./waste-containers.json', import.meta.url));
    const data = await raw_data.json();
    const containers = data.data;
    const categories_data = [
        {
            name: 'mixed',
            label: 'Контейнери за смесени отпадъци',
            emoji: '🗑️'
        },
        {
            name: 'package_recycling',
            label: 'Контейнери за разделно събиране',
            emoji: '♻️',
            label_func: (tags) => {
                const operator = tags['operator'] ?? 'Неизвестен';
                const count = tags['count'] ?? '?';
                if(['Екопак'].includes(operator)) {
                    const colour_counts = ['green', 'yellow', 'blue'].map(colour => tags[`count:${colour}`] ?? '?');
                    const colour_emojies = ['🟢', '🟡', '🔵'];
                    const colour_parts = colour_counts.map((count, index) => {
                        return `${count}x${colour_emojies[index]}`;
                    });
                    return `${count}x♻️ (${colour_parts.join(', ')})`;
                }
                else if(['Екобулпак', 'Булекопак'].includes(operator)) {
                    const colour_counts = ['green', 'yellow'].map(colour => tags[`count:${colour}`] ?? '?');
                    const colour_emojies = ['🟢', '🟡'];
                    const colour_parts = colour_counts.map((count, index) => {
                        return `${count}x${colour_emojies[index]}`;
                    });
                    return `${count}x♻️ (${colour_parts.join(', ')})`;
                }
                return `${count}x♻️`;
            }
        },
        {
            name: 'pet_container',
            label: 'Контейнери за PET бутилки',
            emoji: '💧'
        },
        {
            name: 'clothes_recycling',
            label: 'Контейнери за дрехи',
            emoji: '👕'
        },
        {
            name: 'electronic_recycling',
            label: 'Контейнери за електронни отпадъци',
            emoji: '📱'
        },
        {
            name: 'battery_recycling',
            label: 'Контейнери за батерии',
            emoji: '🔋'
        },
        {
            name: 'bottle_return_machines',
            label: 'Машини за връщане на бутилки',
            emoji: '🍼'
        },
        {
            name: 'cooking_oil',
            label: 'Контейнери за използвано готварско олио',
            emoji: '🛢️'
        },
        {
            name: 'plastic_caps',
            label: 'Контейнери за пластмасови капачки',
            emoji: '🩷'
        },
        {
            name: 'unknown_type',
            label: 'Неизвестен тип контейнер',
            emoji: '❓'
        },
        {
            name: 'unknown_waste',
            label: 'Неизвестен отпадък',
            emoji: '❓'
        }
    ];
    const marker_cluster = new L.markerClusterGroup({disableClusteringAtZoom: 17, showCoverageOnHover: false});
    for(const category of categories_data) {
        const {name, label, emoji} = category;
        if(name != 'unknown_type') {
            // continue;
        }
        const row = document.createElement('tr');
        const emoji_el = document.createElement('td');
        emoji_el.innerHTML = emoji;
        const description = document.createElement('td');
        description.innerHTML = label;
        const count = document.createElement('td');
        count.innerHTML = containers[name].length;
        row.appendChild(emoji_el);
        row.appendChild(description);
        row.appendChild(count);
        document.getElementById('legend_table').appendChild(row);
        add_container_to_map(marker_cluster, containers[name], category);
    }
    map.addLayer(marker_cluster);
    document.getElementById('last_updated').innerText = new Date(data.date).toLocaleString();
}

start();