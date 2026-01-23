<script>
    import Title from "/src/components/Title.svelte";
</script>

<Title title={false} />

<main class="container-fluid mt-3">
    <div class="d-flex flex-wrap gap-3 justify-content-center">
        <div class="">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Интеграция на данни от AllThePlaces</h5>
                    <p class="card-text">Инструмент за сравнение на данните в OpenStreetMap и на данните от AllThePlaces.</p>
                    <a href="./atp-osm/" class="btn btn-primary">Към инструмента</a>
                </div>
            </div>
        </div>
        <div class="">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Километрични маркери</h5>
                    <p class="card-text">Инструмент за сравнение показване на наличните данни за километрични маркери в OpenStreetMap.</p>
                    <a href="./motorway-milestones/" class="btn btn-primary">Към инструмента</a>
                </div>
            </div>
        </div>
        <div class="">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Пътна мрежа</h5>
                    <p class="card-text">Инструмент за визуализация на пътната мрежа в България, базирана на данни от OpenStreetMap.</p>
                    <a href="./road-network/" class="btn btn-primary">Към инструмента</a>
                </div>
            </div>
        </div>
        <div class="">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Контейнери за отпадъци</h5>
                    <p class="card-text">Инструмент за визуализация и проверка на данни за контейнери за отпадъци в OpenStreetMap.</p>
                    <a href="./waste-containers/" class="btn btn-primary">Към инструмента</a>
                </div>
            </div>
        </div>
    </div>
</main>