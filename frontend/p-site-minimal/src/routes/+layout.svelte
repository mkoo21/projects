<script>
    import '/src/styles.css';

    export const prerender = true; // prerender by default
</script>

<main class="flex flex-col items-center justify-center">
    <slot />
</main>