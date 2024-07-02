<script>
    export let cols = 4;
</script>

<div class={`grid grid-cols-${cols} gap-4 font-semibold fade-in`}>
    <slot>Empty grid</slot>
</div>

<style>
    .fade-in {
        animation: fade-in 1s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    }
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>