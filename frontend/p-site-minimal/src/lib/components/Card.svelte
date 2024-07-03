
<button class="grid grid-cols-5 gap-5 p-5 w-56 rounded-md bg-gray-500/30 fade-on-hover items-center ">
    <div class="col-span-1 text-xl text-white">
        <slot name="icon">
            ?
        </slot>
    </div>
    <div class="col-span-4 justify-self-start font-normal">
        <slot name="text">
            Missing text
        </slot>
    </div>
</button>

<style lang="scss">
    .fade-on-hover:hover {
        animation: fade-in 0.25s linear;
    }

    @keyframes fade-in {
    0% {
        background: rgba(107, 114, 128, 0.2);
    }
    100% {
        background: rgba(107, 114, 128, 0.3);
    }
    }
</style>
