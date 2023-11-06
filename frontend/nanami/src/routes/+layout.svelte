<script>
	import Header from './Header.svelte';
	import './styles.css';
	import IconEmailFast from '~icons/mdi/email-fast-outline';
	import IconGithub from '~icons/mdi/github';
	import IconSO from '~icons/mdi/stack-overflow';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
		<p>By Martin Koo</p>
		<div class="socials">
			<a href="https://github.com/mkoo21" target="_blank"><IconGithub /></a>
			<a href="https://stackoverflow.com/users/6723859/sozettasho" target="_blank"><IconSO /></a>
			<a href="mailto:koo.martin@gmail.com"><IconEmailFast /></a>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	.socials {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
