<script lang="ts">
	import ArrowDownIcon from '~icons/mdi/KeyboardArrowDown';
    import { onMount } from 'svelte';

	let DownIconElement: HTMLElement | undefined;

    // Fade icon as user scrolls down
	const handleScroll = (e: Event) => {
		if(DownIconElement && e.currentTarget && (e.currentTarget as Window).scrollY && DownIconElement.firstChild) {
            const opacityHundreds = 100 - Math.min(100, (e.currentTarget as Window).scrollY);
            (DownIconElement.firstChild as HTMLElement).style.opacity = String(opacityHundreds / 100);
        }
	}

    onMount(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    
</script>


<div id="arrow-icon" class="arrow-down-scroll-indicator" bind:this={DownIconElement}><ArrowDownIcon style="font-size: 3em" /></div>

<style>
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