<h1 class="text-7xl font-bold font-ornamental">{@html template}</h1>

<style>
    h1 {
        text-shadow: 2px 2px 5px #ccf;
    }
    h1 :global(.scrambled) {
        color: #333;
        text-shadow: 0 0 0 black;
    }
</style>

<script lang="ts">
    import { onMount } from 'svelte';

    const START_STRING = "";
    const END_STRING = "Welcome to my world";
    const START_TIME = 1000;
    const ANIMATION_LENGTH = 1000;
    const FRAME_LENGTH = 16;
    const MUTATION_CHANCE = 0.25;
    const CHAR_SET = "!<>-_\\/[]{}—=+*^?#________";
    const getRandomChar = () => CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];

    const createAnimationData = (oldText: string, newText: string) => {
        // Preallocate an "array" of chars to animate
        const len = Math.max(oldText.length, newText.length);
        const data = [];
        for(let i = 0; i < len; i++) {
            const initial = oldText[i] || '';
            const final = newText[i] || '';
            const startTime = Math.floor(Math.random() * START_TIME);
            const endTime = ANIMATION_LENGTH + startTime;
            const randomChar = getRandomChar();
            data.push({ initial, final, startTime, endTime, randomChar });
        }
        return data;
    }

    // Do the work
    let template = START_STRING;
    onMount(() => {
        const animationData = createAnimationData(START_STRING, END_STRING);
        const update = (currentFrame: number) => {
            let result = "";
            for(let i = 0; i < animationData.length; i++) {
                let charData = animationData[i];
                
                if(currentFrame < charData.startTime) {
                    result += charData.initial;
                }
                else if(currentFrame < charData.endTime) {
                    if(Math.random() < MUTATION_CHANCE) charData.randomChar = getRandomChar();
                    result += `<span class="scrambled">${charData.randomChar}</span>`;
                }
                else {
                    result += charData.final;
                }
            }
            template = result;
            if(currentFrame < START_TIME + ANIMATION_LENGTH) {
                setTimeout(() => update(currentFrame + FRAME_LENGTH), 16)
            }
        }
        update(0);

    }); 
</script>