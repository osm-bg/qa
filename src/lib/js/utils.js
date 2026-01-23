export function make_osm_link(type, id, coords=null) {
    let map_url = 'https://www.openstreetmap.org/';
	let edit_url = 'https://www.openstreetmap.org/edit';
	if(type && id) {
		map_url += `${type}/${id}`
		edit_url += `?${type}=${id}`
	}
	else {
		const [lat, lon] = coords.map(number => number.toFixed(5));
		map_url += `?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;
		edit_url += `#map=18/${lat}/${lon}`;
	}
    const map_link = `<a class="btn btn-outline-primary" href="${map_url}" target="_blank"><i class="bi bi-globe2"></i> OSM</a>`;
    const edit_link = `<a class="btn btn-outline-primary" href="${edit_url}" target="_blank"><i class="bi bi-pencil"></i> iD</a>`;
    return `<div class="btn-group">${map_link}${edit_link}</div>`;
}