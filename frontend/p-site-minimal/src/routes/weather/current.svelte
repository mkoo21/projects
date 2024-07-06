<script>
    export let updatedAt = new Date().toLocaleDateString();
    export let location = "";
    export let condition = "Sunny";
    export let temp = "";
    export let feelslike = "";
    export let windkph = "";
    export let humidity = "";
</script>
<div class="p-5 w-80 rounded-xl gap-2 bg-gray-500/30 fade-on-hover items-center flex flex-col">
    <div class="w-[80%]">
        { location }
        
    </div>
    <div class="w-[80%]">
        { updatedAt }
    </div>
    <div class="w-[80%]">
        { temp }° C
    </div>
    <div class="w-[80%]">
        { condition }
    </div>
    <div class="w-[80%]">
        Feels like { feelslike }° C
    </div>
    <div class="w-[80%]">
        Wind { windkph } km/h
    </div>
    <div class="w-[80%]">
        Humidity { humidity }
    </div>
</div>

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
