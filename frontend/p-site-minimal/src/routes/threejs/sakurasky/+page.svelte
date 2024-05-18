<script lang="ts">
    import { onMount } from 'svelte';
    import { initScene } from './scripts';


    let canvasElement: HTMLDivElement | undefined;

    onMount(() => {
        const { main, composer } = initScene(canvasElement);

        let loopRef = requestAnimationFrame(main);
        composer.render();
        return () => {
            cancelAnimationFrame(loopRef);
            
        }
    })
    
</script>

<div bind:this={canvasElement} />