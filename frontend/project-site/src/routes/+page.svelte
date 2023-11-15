<script>
	import WorksGrid from './works/Grid.svelte';
	import ArrowDownIcon from '~icons/mdi/KeyboardArrowDown';

	let DownIconElement;


</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Martin Koo's portfolio site" />
</svelte:head>

<section class="hero">
		<h1>This is a cool graphic</h1>
		<div class="arrow-down-scroll-indicator" bind:this={DownIconElement}><ArrowDownIcon style="font-size: 3em" /></div>
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

	.arrow-down-scroll-indicator {
		position: fixed;
		width: 100vw;
		display: flex;
		justify-content: center;
		bottom: 40px;

		-webkit-animation: flip-in 0.3s ease-out both, heartbeat 0.3s ease-in-out 2 both;
		animation: flip-in 0.3s ease-out both, heartbeat 0.3s ease-in-out 2 both;
		animation-delay: 1s, 1.5s;
	}

	/* Icon animations */
	/* flip in */
	@-webkit-keyframes flip-in {
		0% {
			-webkit-transform: rotateY(90deg);
					transform: rotateY(90deg);
			opacity: 0;
		}
		100% {
			-webkit-transform: rotateY(0);
					transform: rotateY(0);
			opacity: 1;
		}
	}
	@keyframes flip-in {
		0% {
			-webkit-transform: rotateY(90deg);
					transform: rotateY(90deg);
			opacity: 0;
		}
		100% {
			-webkit-transform: rotateY(0);
					transform: rotateY(0);
			opacity: 1;
		}
	}
	/* heartbeat */
	@-webkit-keyframes heartbeat {
		/* 0% {
			-webkit-transform: scale(1);
					transform: scale(1);
		} OVERWRITES 0% FROM PREVIOUS ANIMATION*/
		
		50% {
			-webkit-transform: scale(1.3);
					transform: scale(1.3);
		}
		100% {
			-webkit-transform: scale(1);
					transform: scale(1);
		}
	}
	@keyframes heartbeat {
		/* 0% {
			-webkit-transform: scale(1);
					transform: scale(1);
		} OVERWRITES 0% FROM PREVIOUS ANIMATION */
		50% {
			-webkit-transform: scale(1.3);
					transform: scale(1.3);
		}
		100% {
			-webkit-transform: scale(1);
					transform: scale(1);
		}
	}
</style>
