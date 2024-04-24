<script>
    export let cols = 4;
</script>

<div class={`grid grid-cols-${cols} gap-4 font-semibold`}>
    <slot>Empty grid</slot>
</div>
