<script>
    export let route;
    export let is_shown = route.is_shown;
    export let label;
</script>
<button 
class="btn btn-sm m-1"
class:btn-outline-primary={!is_shown}
class:btn-primary={is_shown}
on:click
>
    {label}
</button>
