<script>
    let {checked, counts} = $props();
</script>
<table class="table table-bordered table-sm">
    <thead>
        <tr class="table-secondary text-center">
            <th colspan="6">Легенда</th>
        </tr>
        <tr class="text-center align-middle">
            <th></th>
            <th>Икона</th>
            <th>ATP</th>
            <th>OSM</th>
            <th>Разстояние / Тагове</th>
            <th>Брой</th>
        </tr>
    </thead>
    <tbody>
        <tr class="text-center align-middle">
            <td><input class="form-check-input" type="checkbox" bind:checked={checked.atp_only}></td>
            <td><img height="30px" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="Зелена икона"></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td><span class="h4 fw-bold text-danger">X</span></td>
            <td><span class="fw-bolder text-muted">N/A</span></td>
            <td>{counts.atp_only}</td>
        </tr>
        <tr class="text-center align-middle">
            <td><input class="form-check-input" type="checkbox" bind:checked={checked.osm_only}></td>
            <td><img height="30px" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="Червена икона"></td>
            <td><span class="h4 fw-bold text-danger">X</span></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td><span class="fw-bolder text-muted">N/A</span></td>
            <td>{counts.osm_only}</td>
        </tr>
        <tr class="text-center align-middle">
            <td><input class="form-check-input" type="checkbox" bind:checked={checked.different}></td>
            <td><img height="30px" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" alt="Оранжева икона"></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td><span class="h4 fw-bolder text-warning">~</span></td>
            <td>{counts.different}</td>
        </tr>
        <tr class="text-center align-middle">
            <td><input class="form-check-input" type="checkbox" bind:checked={checked.same}></td>
            <td><img height="30px" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt="Синя икона"></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td><i class="h4 bi bi-check-lg text-success"></i></td>
            <td>{counts.same}</td>
        </tr>
    </tbody>
</table>