<script>
    import boids_static from '$lib/images/boids_preview.webp';
    import boids_animated from '$lib/images/boids_preview.webm';
</script>

<div class="grid">
    <div class="grid-item">
        <img src={boids_static} alt="boids preview"/>
    </div>
    <div class="grid-item">
        
    </div>
    <div class="grid-item" />
    <div class="grid-item" />
    <div class="grid-item" />
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 5px;
    }
    .grid-item {
        background: var(--color-theme-1);
        grid-column: span 1;
        height: 300px;

        & img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }
</style>