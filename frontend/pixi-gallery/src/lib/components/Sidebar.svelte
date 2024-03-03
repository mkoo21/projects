<script lang="ts">
    export let open = false;
    export let sidebarRef: HTMLElement;
</script>

<nav class="sidebar" class:active={open} bind:this={sidebarRef}>
    foo!
</nav>

<style lang="scss">
    .sidebar {
        position: fixed;
        left: calc(0px - var(--sidebar-width));
        transition: left 0.2s;
        height: 100%;
        background: white;
        &.active {
            width: var(--sidebar-width);
            box-shadow: 3px -1px 3px -2px #888;
            left: 0;

        }
    }
</style>