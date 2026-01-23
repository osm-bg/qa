<script>
	import favicon from '$lib/assets/favicon.svg';
    import { base } from '$app/paths';
	import "$lib/custom.scss";


	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="{base}/">Инструменти за OSM:BG</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link" href="{base}/">Начало</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="{base}/atp-osm/">ATP &lt;=&gt; OSM</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="{base}/motorway-milestones/">Километрични маркери</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="{base}/road-network/">Пътна мрежа</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="{base}/waste-containers/">Контейнери</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<main class="container mt-3">
	{@render children()}
</main>

