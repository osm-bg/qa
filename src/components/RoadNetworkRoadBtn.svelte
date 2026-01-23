<script>
    export let route;
    export let is_shown = route.is_shown;
    let route_ref = route.ref;
    if(typeof route.ref === 'number') {
        const prefix = route.ref.toString().split('').map(a => 'I').join('');
        route_ref = `${prefix}-${route.ref}`;
    }
</script>
<button 
class="btn btn-sm m-1"
class:btn-outline-primary={!is_shown}
class:btn-primary={is_shown}
on:click
>
    {route_ref}
</button>