<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { onMount, SvelteComponent } from 'svelte';
    import './styles.css';
    let sidebarOpen = false;
    let sidebarRef: HTMLElement;
    let headerRef: HTMLElement;

    let handleClick = (event: MouseEvent) => {
        // If click is outside sidebar or header, close the sidebar
        if(!event.target) return;
        if(sidebarRef && sidebarRef.contains(event.target as Node)) {
            return;
        }
        if(headerRef && headerRef.contains(event.target as Node)) {
            return;
        }
        // Click was outside sidebar
        sidebarOpen = false;
        
    }
    let handleKeyEvent = (event: KeyboardEvent) => {
        if(event.key == "Escape") {
            sidebarOpen = false;
        }
    }
    onMount(() => {

    });
</script>

<div class="app" on:click={handleClick} on:keydown={handleKeyEvent} role="none">
    <!-- Header -->
    <Header bind:sidebarOpen={sidebarOpen} bind:headerRef={headerRef}/>
 
    <!-- Sidebar -->
    <Sidebar open={sidebarOpen} bind:sidebarRef={sidebarRef} />

    <!-- Main -->
    <main>
        <slot />
    </main>
</div>

<style lang="scss">
    .header{
        z-index: 1;
        height: var(--header-height);
    }

    .sidebar {
        z-index: 1;
        width: var(--sidebar-width);
        display: none;
        left: calc(0px - var(--sidebar-width));

        :active {
            // transform
        }
    }

    main {
        margin-top: var(--header-height);
        margin-left: 40px;
    }

</style>