<script lang="ts">
	import WorksGrid from './works/Grid.svelte';
	import DownArrowOverlay from './ScrollOverlay.svelte';

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Martin Koo's portfolio site" />
</svelte:head>

<section class="hero">
		<h1>This is a cool graphic</h1>
		<DownArrowOverlay />
</section>

<section class="main">
	<WorksGrid />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.hero {
		position: fixed;
		inset: 0px;
		height: 100dvh;
		width: 100dvw;
		background: white;
		
		display:flex;
		align-items: center;
		justify-content: center;
		z-index: -1;
	}

	.main {
		margin-top: 100dvh;
		background: white;
	}

</style>
