<script>
    import DotsHorizontal from "~icons/mdi/dots-horizontal";
    
</script>

<header>
    <div class="left cell">
        <span class="hbtn" style=""><DotsHorizontal style="font-size:1.5em"  /></span>
    </div>
    <div class="middle"></div>
    <div class="right"></div>
</header>

<style lang="scss">
    header {
        display: flex;
        justify-content: space-between;
        background-color: rgba(0,0,0,0.7);
        height: var(--header-height);
    }
    .cell {
        height: 100%;
        display: flex;
        align-items:center;
        padding: 0 10px 0 10px;
        color: white;
    }
    .left {
        padding-left: 14px;
    }
</style>
