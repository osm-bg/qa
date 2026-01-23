<script>
	import "leaflet/dist/leaflet.css";
	import { onMount } from "svelte";
	import L from "leaflet";
	let map;
	export let startZoom = 7;
	export let minZoom = 7;
	export let maxZoom = 18;
	export let height = "400px";

	onMount(async () => {
		map = L.map('map').setView([42.740, 25.450], startZoom);

		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			minZoom: minZoom,
			maxZoom: maxZoom,
			maxNativeZoom: 19
		}).addTo(map);

		map.invalidateSize();
	});

	export function get_map() {
		return map;
	}
</script>

<style>
	#map {
		width: 100%;
		height: var(--map-height);
	}
</style>

<div id="map" style="--map-height: {height};"></div>