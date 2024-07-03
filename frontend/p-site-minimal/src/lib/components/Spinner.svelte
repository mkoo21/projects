
<div class="lds-dual-ring"></div>


<style>
    .lds-dual-ring {
        opacity: 0.75;
    }
    .lds-dual-ring,
    .lds-dual-ring:after {
        box-sizing: border-box;
    }
    .lds-dual-ring {
        display: block;
        width: 25vh;
        height: 25vh;
    }
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 100%;
        height: 100%;
        /* margin: 8px; */
        border-radius: 50%;
        border: 6.4px solid currentColor;
        border-color: currentColor transparent currentColor transparent;
        animation: lds-dual-ring 0.75s cubic-bezier(0.1, 0.6, 0.8, 0.1) infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>