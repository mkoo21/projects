<script>
	import Grid from '/src/lib/components/Grid.svelte';
	import Card from '/src/lib/components/Card.svelte';
	import IconThreeJS from '$lib/images/icon_threejs.png';
	import Header from './HeroHeader.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Martin Koo's portfolio site" />
</svelte:head>

<section>
	<Header />
</section>
<section>
	<Grid>
		<Card>
			<span slot="icon"><img src={IconThreeJS} alt="SvelteKit" /></span>
			<span slot="text">ThreeJS</span>
		</Card>
	</Grid>
</section>