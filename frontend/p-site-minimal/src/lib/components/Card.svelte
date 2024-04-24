
<button class="grid grid-cols-5 gap-5 p-5 w-56 rounded-md bg-gray-500/30 hover:bg-gray-500/40 items-center ">
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
