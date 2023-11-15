<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import WorksGrid from './works/Grid.svelte';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Martin Koo's portfolio site" />
</svelte:head>

<section class="hero">
		<h1>This is a cool graphic</h1>
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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
