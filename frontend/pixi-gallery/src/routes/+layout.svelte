<script>
    import Header from '$lib/components/Header.svelte';
    import { onMount } from 'svelte';
    import './styles.css';
    let sidebarOpen = false;


    let toggleSidebar = () => sidebarOpen = !sidebarOpen;
    let handleClickOffSidebar = () => {
        // If click is outside sidebar, close the sidebar
        
    }
    onMount(() => {
    }
</script>

<div class="app">
    <!-- Header -->
    <Header />
    <!-- Sidebar -->

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