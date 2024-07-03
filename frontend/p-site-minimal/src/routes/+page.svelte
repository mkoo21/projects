<script>
	import Grid from '/src/lib/components/Grid.svelte';
	import Card from '/src/lib/components/Card.svelte';
	import IconThreeJS from '$lib/images/icon_threejs.png';
	import Scrambler from './Scrambler.svelte';
	import Spinner from '/src/lib/components/Spinner.svelte';

	let loaded = false;

	setTimeout(() => {
		loaded = true;
	}, 750);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Martin Koo's portfolio site" />
</svelte:head>

{#if !loaded}
<section>
	<Spinner />
</section>

{:else}
<section>
	<Grid>
		<Card>
			<span slot="icon"><img src={IconThreeJS} alt="SvelteKit" /></span>
			<span slot="text">ThreeJS</span>
		</Card>
	</Grid>
</section>
{/if}
